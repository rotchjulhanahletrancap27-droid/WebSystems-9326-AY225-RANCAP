$(document).ready(function () {

    const BASE = 'https://www.geeksforgeeks.org/';

    /* ─────────────────────────────────────────
       CORS proxies
    ───────────────────────────────────────── */
    const PROXIES = [
        {
            name: 'corsproxy.io',
            build: u => `https://corsproxy.io/?${encodeURIComponent(u)}`,
            get: async r => r.text()
        },
        {
            name: 'allorigins.win',
            build: u => `https://api.allorigins.win/get?url=${encodeURIComponent(u)}`,
            get: async r => (await r.json()).contents
        },
        {
            name: 'codetabs.com',
            build: u => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`,
            get: async r => r.text()
        },
        {
            name: 'thingproxy.freeboard.io',
            build: u => `https://thingproxy.freeboard.io/fetch/${u}`,
            get: async r => r.text()
        }
    ];

    /* ─────────────────────────────────────────
       DOM references
    ───────────────────────────────────────── */
    const $slug   = $('#slugInput');
    const $prev   = $('#fullUrlPreview');
    const $scrape = $('#scrapeBtn');
    const $dl     = $('#downloadBtn');
    const $clear  = $('#clearBtn');
    const $out    = $('#scrapedContent');
    const $pdf    = $('#pdfContainer');
    const $proxy  = $('#proxyLog');
    const $prog   = $('#progressContainer');
    const $bar    = $('#progressBar');
    const $status = $('#statusText');
    const $stage  = $('#stageBadge');
    const $msg    = $('#messageContainer');
    const $stats  = $('#statsSection');
    const $hint   = $('#hintBox');
    const $hlink  = $('#hintLink');

    let artTitle = '';
    let artDate  = '';

    /* ─────────────────────────────────────────
       Slug validation keywords
    ───────────────────────────────────────── */
    const CN_KEYS = [
        'computer-network', 'osi', 'tcp', 'udp', 'ipv', 'dns', 'dhcp',
        'http', 'ftp', 'ssl', 'tls', 'subnet', 'routing', 'switching',
        'firewall', 'wi-fi', 'wifi', 'wireless', 'ethernet', 'lan', 'wan',
        'mac-address', 'arp', 'icmp', 'nat', 'vpn', 'topology', 'protocol',
        'socket', 'network', 'bandwidth', 'packet', 'hub', 'router',
        'bridge', 'gateway', 'basics-computer'
    ];

    function slugOk(slug) {
        if (!slug) return false;
        const low = slug.toLowerCase();
        if (!low.includes('/') && low.length < 5) return false;
        if (/[?&]/.test(low)) return false;
        return CN_KEYS.some(k => low.includes(k));
    }

    /* ─────────────────────────────────────────
       UI helpers
    ───────────────────────────────────────── */
    function getFullUrl() {
        return BASE + $slug.val().trim().replace(/^\/+/, '');
    }

    function activatePill(slug) {
        $('.pill').removeClass('active');
        if (slug) $('.pill[data-slug="' + slug + '"]').addClass('active');
    }

    const showProg = () => $prog.show();
    const hideProg = () => $prog.hide();

    function setProg(pct, msg, icon) {
        $bar.css('width', pct + '%').text(pct + '%');
        $status.text(msg);
        $stage.text(icon || '⏳');
    }

    function setUI(off) {
        $scrape.prop('disabled', off);
        $dl.prop('disabled', off || !artTitle);
        $slug.prop('disabled', off);
    }

    function flash(type, text) {
        const d = $('<div>')
            .addClass(type === 'err' ? 'warning-message' : 'success-message')
            .text(text);
        $msg.empty().append(d);
        setTimeout(() => d.fadeOut(), 5500);
    }

    function logProxy(msg, err = false) {
        $proxy.html('⌨️ proxy: ' + msg);
        err ? $proxy.addClass('error') : $proxy.removeClass('error');
    }

    /* ─────────────────────────────────────────
       Fetch with proxy fallback
    ───────────────────────────────────────── */
    async function fetchHTML(url) {
        const errs = [];
        for (const p of PROXIES) {
            logProxy('trying ' + p.name + ' ...');
            try {
                const res = await fetch(p.build(url), { signal: AbortSignal.timeout(15000) });
                if (!res.ok) throw new Error('HTTP ' + res.status);
                const html = await p.get(res);
                if (!html || html.length < 500) throw new Error('response too short');
                logProxy('✓ ' + p.name + ' ok · 📡 computer networks');
                return html;
            } catch (e) {
                logProxy('✗ ' + p.name + ': ' + e.message);
                errs.push(p.name + ': ' + e.message);
            }
        }
        throw new Error('All proxies failed.\n' + errs.join('\n'));
    }

    /* ─────────────────────────────────────────
       Extract article title + date
    ───────────────────────────────────────── */
    function getHeader($doc) {
        let t = '', d = 'Not Available';

        const tSels = [
            '.ArticleHeader_article-title__futDC h1',
            'h1.article-title', 'h1.post-title',
            '.entry-title', 'article h1', 'main h1',
            '.content h1', 'h1'
        ];
        for (const s of tSels) {
            const $t = $doc.find(s).first();
            if ($t.length && $t.text().trim().length > 3) { t = $t.text().trim(); break; }
        }

        const dSels = [
            '.ArticleHeader_last_updated_parent__ohhpb', '.last-updated',
            '.post-date', '.entry-date', 'time',
            '[itemprop="dateModified"]', '[itemprop="datePublished"]', '.date'
        ];
        for (const s of dSels) {
            const $d = $doc.find(s).first();
            if ($d.length) {
                const txt = $d.text().trim()
                    .replace(/last\s+updated:?\s*/i, '')
                    .replace(/published:?\s*/i, '');
                if (txt.length > 5) { d = txt; break; }
            }
        }
        return { t, d };
    }

    /* ─────────────────────────────────────────
       Extract article body
    ───────────────────────────────────────── */
    const REMOVE_TITLES = [
        'related articles', 'recommended', 'advertisement', 'trending',
        'improve', 'save', 'share', 'report issue', 'please login',
        'comment', 'subscribe', 'newsletter', 'suggest changes'
    ];
    const badTitle = t => t && REMOVE_TITLES.some(r => t.toLowerCase().includes(r));

    function extractBody(html) {
        const $doc = $('<div>').html(html);
        const { t, d } = getHeader($doc);
        artTitle = t;
        artDate  = d;

        // Remove noise elements
        $doc.find([
            'script', 'style', 'iframe', 'noscript',
            '.ads', '.advertisement', '.sidebar', 'footer', 'header', 'nav',
            '.comments', '.recommended', '.related-articles', '.suggested-reading',
            '.trending-articles', '.popular-posts', '.google-ads', '.ad-container',
            '.leftSideBar', '.rightSideBar', '.bottomBar'
        ].join(',')).remove();

        // Try specific GfG selectors first
        const bodySels = [
            '.article--viewer_content', '.article-content', '.entry-content',
            'article .text', 'main article', '.post-body', '.post-content',
            'article', 'main', '#main'
        ];
        let $body;
        for (const s of bodySels) {
            $body = $doc.find(s).first();
            if ($body.length && $body.text().trim().length > 300) break;
        }
        if (!$body || $body.text().trim().length < 300) {
            $body = $doc.find('body');
        }

        // Clean up attributes and empty elements
        $body.find('*').each(function () {
            const $el = $(this);
            if ($el.text().trim() === '' && !$el.is('br,img,hr')) { $el.remove(); return; }
            if ($el.is('h1,h2,h3,h4,h5,h6') && badTitle($el.text())) { $el.remove(); return; }
            const keep = ['href', 'src', 'alt', 'title'];
            $.each(this.attributes, function () {
                if (!keep.includes(this.name) && !this.name.startsWith('data-')) {
                    $el.removeAttr(this.name);
                }
            });
        });

        return $body;
    }

    /* ─────────────────────────────────────────
       Format content for preview / PDF
    ───────────────────────────────────────── */
    function format($body, withCopy = true) {
        const $wrap = $('<div>').addClass(withCopy ? 'scraped-content' : 'pdf-content');

        // Article header card
        const $hdr = $('<div>').addClass('article-header');
        $hdr.append('<h1>' + (artTitle || 'Computer Networks Article') + '</h1>');
        const meta = [];
        if (artDate !== 'Not Available') meta.push('📅 ' + artDate);
        meta.push('📡 subject: computer networks');
        meta.push('🔗 geeksforgeeks.org');
        $hdr.append('<div class="article-meta">' + meta.join(' &nbsp;·&nbsp; ') + '</div>');
        $wrap.append($hdr);

        const $p = $body.clone();

        // Style code blocks
        $p.find('pre').each(function () {
            $(this).css({
                background: '#e1d7cf',
                border: '1px solid #b2a18f',
                borderRadius: '20px',
                padding: '18px',
                margin: '15px 0',
                position: 'relative'
            });
            if (withCopy) {
                const $btn = $('<button>').addClass('copy-btn').html('📋 copy');
                $(this).append($btn);
                $btn.on('click', function (e) {
                    e.stopPropagation();
                    const code = $(this).parent().find('code').text() || $(this).parent().text();
                    navigator.clipboard.writeText(code).then(() => {
                        $btn.text('✔️ copied');
                        setTimeout(() => $btn.html('📋 copy'), 2000);
                    });
                });
            }
        });

        $p.find('code').not('pre code').css({ background: '#ded3c9', padding: '3px 7px', borderRadius: '14px' });
        $p.find('table').css({ borderCollapse: 'collapse', width: '100%', margin: '15px 0' });
        $p.find('th,td').css({ border: '1px solid #b7a695', padding: '9px' });
        $p.find('th').css({ background: '#d2c5b8' });
        $p.find('ul,ol').css({ margin: '10px 0 10px 30px' });
        $p.find('blockquote').css({ borderLeft: '6px solid #9b897a', paddingLeft: '18px', margin: '15px 0', background: '#ede5dd', borderRadius: '0 20px 20px 0' });
        $p.find('img').css({ maxWidth: '100%', borderRadius: '16px', border: '1px solid #bfb0a1' });
        $p.find('a').css({ color: '#6d4f39', textDecoration: 'underline' });
        $p.find('*').css('color', '#1f1f1f');

        $wrap.append($p.contents());
        return $wrap;
    }

    /* ─────────────────────────────────────────
       Update stats panel
    ───────────────────────────────────────── */
    function refreshStats($preview) {
        const words = $preview.text().split(/\s+/).filter(w => w.length).length;
        $('#wordCount').text(words.toLocaleString());
        $('#headingCount').text($preview.find('h1,h2,h3,h4,h5,h6').length);
        $('#codeBlocks').text($preview.find('pre').length);
        $('#titleLength').text(artTitle.length);
        $('#lastUpdated').text(artDate);
        $stats.css('display', 'flex');
    }

    /* ─────────────────────────────────────────
       SCRAPE
    ───────────────────────────────────────── */
    async function doScrape(forcedSlug) {
        const slug = (forcedSlug || $slug.val().trim()).replace(/^\/+/, '');
        if (!slug) { flash('err', 'enter a URL slug'); return; }

        if (!slugOk(slug)) {
            $slug.addClass('input-error');
            $hlink.text('computer-networks/basics-computer-networking/');
            $hint.show();
            flash('err', '⚠️ Slug doesn\'t look like a Computer Networks article. Use the topic buttons.');
            return;
        }

        const fullUrl = BASE + slug;
        $slug.val(slug).removeClass('input-error');
        $prev.text(fullUrl);
        $hint.hide();
        activatePill(slug);
        setUI(true);
        showProg();
        setProg(10, 'starting…', '⬜');

        try {
            setProg(20, 'fetching · ' + fullUrl, '📡');
            const html = await fetchHTML(fullUrl);

            setProg(50, 'extracting content', '✂️');
            const $body = extractBody(html);

            if ($body.text().trim().length < 400) {
                throw new Error('Content too short — this may not be a full article. Try a topic button above.');
            }

            setProg(70, 'formatting', '🖌️');
            const $preview = format($body, true);
            const $pdfBody = format($body, false);

            setProg(90, 'rendering preview', '👁️');
            $out.empty().append($preview);
            $pdf.empty().append($pdfBody);

            refreshStats($preview);
            setProg(100, 'done!', '✅');
            flash('ok', '✅ Article scraped successfully!');
            $dl.prop('disabled', false);
            setTimeout(hideProg, 1200);

        } catch (err) {
            console.error(err);
            flash('err', err.message.length < 150 ? err.message : 'Scrape failed — try a topic button above');
            logProxy('❌ failed', true);
            setUI(false);
            hideProg();
        }
    }

    /* ─────────────────────────────────────────
       PDF export
    ───────────────────────────────────────── */
    async function doPDF() {
        const $el = $pdf.children().first();
        if (!$el.length) { flash('err', 'no content to export'); return; }

        setUI(true);
        showProg();
        setProg(10, 'preparing pdf', '📄');

        try {
            const slug = (artTitle || 'computer-networks')
                .replace(/[^a-z0-9]+/gi, '-')
                .toLowerCase()
                .substring(0, 50);
            const filename = 'CN_' + slug + '.pdf';

            setProg(40, 'generating…', '🖨️');
            await html2pdf().set({
                margin: [0.5, 0.5, 0.5, 0.5],
                filename,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, backgroundColor: '#ffffff', logging: false },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
            }).from($el[0]).save();

            setProg(100, 'saved!', '💾');
            flash('ok', 'PDF saved as ' + filename);

        } catch (e) {
            console.error(e);
            flash('err', 'PDF export failed');
        } finally {
            setUI(false);
            setTimeout(hideProg, 1200);
        }
    }

    /* ─────────────────────────────────────────
       Clear
    ───────────────────────────────────────── */
    function doClear() {
        artTitle = '';
        artDate  = '';
        $out.html(`
            <div class="placeholder-msg">
                <div class="big">📡</div>
                <p>Click a topic button above or type a slug and click <strong>scrape</strong><br>
                Base URL is locked to <strong>https://www.geeksforgeeks.org/</strong></p>
            </div>
        `);
        $pdf.empty();
        $stats.hide();
        $hint.hide();
        $dl.prop('disabled', true);
        $slug.val('').removeClass('input-error');
        $prev.text(BASE);
        logProxy('ready · topic: computer networks');
        activatePill('');
        flash('ok', 'cleared');
        setUI(false);
    }

    /* ─────────────────────────────────────────
       Event bindings
    ───────────────────────────────────────── */
    $('.pill').on('click', function () {
        const s = $(this).data('slug');
        $slug.val(s);
        $prev.text(BASE + s);
        doScrape(s);
    });

    $hlink.on('click', function () {
        const s = 'computer-networks/basics-computer-networking/';
        $slug.val(s);
        $prev.text(BASE + s);
        doScrape(s);
    });

    $slug.on('input', function () {
        $prev.text(getFullUrl());
        $hint.hide();
        $slug.removeClass('input-error');
    });

    $slug.on('keypress', e => { if (e.which === 13) doScrape(); });

    $scrape.on('click', () => doScrape());
    $dl.on('click',     doPDF);
    $clear.on('click',  doClear);

    // Init
    $dl.prop('disabled', true);
    $prev.text(BASE + $slug.val().trim());
});