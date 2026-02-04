// Main JavaScript file for College of Computer Studies website

// ===== NAVIGATION =====
document.addEventListener('DOMContentLoaded', function() {
    const nav = document.getElementById('mainNav');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
    
    // Scroll effect on navigation
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Highlight active page in navigation
    highlightActivePage();
});

function highlightActivePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// ===== COUNTER ANIMATION =====
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Intersection Observer for counter animation
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            const statNumber = entry.target.querySelector('.stat-number');
            if (statNumber) {
                const target = parseInt(statNumber.getAttribute('data-target'));
                animateCounter(statNumber, target);
                entry.target.classList.add('animated');
            }
        }
    });
}, observerOptions);

// Observe stat cards
document.addEventListener('DOMContentLoaded', function() {
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => counterObserver.observe(card));
});

// ===== ANNOUNCEMENTS DATA =====
const announcementsData = [
    {
        id: 1,
        date: 'February 3, 2026',
        title: 'Spring 2026 Enrollment Now Open',
        content: 'Applications for Spring 2026 semester are now being accepted. Visit the admissions office or apply online through our student portal. Early application deadline is March 15, 2026.'
    },
    {
        id: 2,
        date: 'February 1, 2026',
        title: 'Tech Innovation Summit - March 2026',
        content: 'Join us for our annual Tech Innovation Summit featuring industry leaders, workshops, and networking opportunities. Registration opens February 10th.'
    },
    {
        id: 3,
        date: 'January 28, 2026',
        title: 'New AI Research Lab Opens',
        content: 'We are proud to announce the opening of our state-of-the-art Artificial Intelligence Research Laboratory, equipped with cutting-edge technology and resources for students and faculty.'
    },
    {
        id: 4,
        date: 'January 25, 2026',
        title: 'Scholarship Applications Available',
        content: 'Merit-based and need-based scholarship applications for 2026-2027 academic year are now available. Application deadline: March 31, 2026.'
    },
    {
        id: 5,
        date: 'January 20, 2026',
        title: 'Industry Partnership with Tech Giants',
        content: 'CCS has established new partnerships with leading technology companies to provide internship opportunities and industry-sponsored projects for our students.'
    }
];

// Load announcements on home page
function loadAnnouncements(limit = 3) {
    const container = document.getElementById('announcementsContainer');
    if (!container) return;
    
    const announcementsToShow = announcementsData.slice(0, limit);
    
    container.innerHTML = announcementsToShow.map(announcement => `
        <div class="announcement-card">
            <div class="announcement-date">${announcement.date}</div>
            <h3 class="announcement-title">${announcement.title}</h3>
            <p class="announcement-text">${announcement.content}</p>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', loadAnnouncements);

// ===== EVENTS DATA AND FUNCTIONALITY =====
const eventsData = [
    {
        id: 1,
        title: 'Tech Innovation Summit 2026',
        date: '2026-03-15',
        category: 'Conference',
        location: 'Main Auditorium',
        description: 'Annual summit featuring industry leaders discussing the latest trends in technology, AI, and software development. Includes workshops, panel discussions, and networking opportunities.',
        image: 'conference'
    },
    {
        id: 2,
        title: 'Hackathon: Code for Change',
        date: '2026-03-22',
        category: 'Competition',
        location: 'Computer Labs A-C',
        description: '48-hour hackathon focused on developing solutions for social impact. Teams will compete for prizes and mentorship opportunities.',
        image: 'hackathon'
    },
    {
        id: 3,
        title: 'Career Fair: Tech Opportunities',
        date: '2026-04-05',
        category: 'Career',
        location: 'University Sports Complex',
        description: 'Meet with top tech companies and startups. Bring your resume and portfolio for on-the-spot interviews and networking.',
        image: 'career'
    },
    {
        id: 4,
        title: 'AI & Machine Learning Workshop',
        date: '2026-04-12',
        category: 'Workshop',
        location: 'AI Research Lab',
        description: 'Hands-on workshop covering neural networks, deep learning frameworks, and practical ML applications. Open to all students.',
        image: 'workshop'
    },
    {
        id: 5,
        title: 'Cybersecurity Awareness Week',
        date: '2026-04-20',
        category: 'Seminar',
        location: 'Various Venues',
        description: 'Week-long series of talks and activities focused on cybersecurity best practices, ethical hacking, and digital privacy.',
        image: 'seminar'
    },
    {
        id: 6,
        title: 'Alumni Networking Night',
        date: '2026-05-03',
        category: 'Networking',
        location: 'Student Center',
        description: 'Connect with successful CCS alumni working in various tech industries. Learn about career paths and get valuable advice.',
        image: 'networking'
    },
    {
        id: 7,
        title: 'Open House for Prospective Students',
        date: '2026-05-10',
        category: 'Academic',
        location: 'CCS Building',
        description: 'Tour our facilities, meet faculty and current students, and learn about our programs. Information sessions throughout the day.',
        image: 'openhouse'
    },
    {
        id: 8,
        title: 'Research Symposium',
        date: '2026-05-18',
        category: 'Research',
        location: 'Main Auditorium',
        description: 'Annual research symposium showcasing student and faculty research projects. Poster presentations and oral presentations.',
        image: 'research'
    }
];

// Filter events by category
function filterEvents(category) {
    const container = document.getElementById('eventsGrid');
    if (!container) return;
    
    let filteredEvents = category === 'all' 
        ? eventsData 
        : eventsData.filter(event => event.category === category);
    
    renderEvents(filteredEvents);
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === category) {
            btn.classList.add('active');
        }
    });
}

// Render events
function renderEvents(events) {
    const container = document.getElementById('eventsGrid');
    if (!container) return;
    
    container.innerHTML = events.map(event => {
        const eventDate = new Date(event.date);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = monthNames[eventDate.getMonth()];
        const day = eventDate.getDate();
        
        return `
            <div class="event-card" data-event-id="${event.id}">
                <div class="event-date-badge">
                    <div class="event-month">${month}</div>
                    <div class="event-day">${day}</div>
                </div>
                <div class="event-content">
                    <span class="event-category">${event.category}</span>
                    <h3 class="event-title">${event.title}</h3>
                    <p class="event-location">📍 ${event.location}</p>
                    <p class="event-description">${event.description}</p>
                    <button class="btn btn-outline event-details-btn" onclick="showEventModal(${event.id})">
                        View Details
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Show event modal
function showEventModal(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (!event) return;
    
    const modal = document.getElementById('eventModal');
    const modalContent = document.getElementById('modalEventDetails');
    
    if (!modal || !modalContent) return;
    
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    modalContent.innerHTML = `
        <h2>${event.title}</h2>
        <div class="modal-event-meta">
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p><strong>Category:</strong> ${event.category}</p>
        </div>
        <p class="modal-event-description">${event.description}</p>
        <div class="modal-event-actions">
            <button class="btn btn-primary" onclick="registerForEvent(${event.id})">Register Now</button>
            <button class="btn btn-outline" onclick="addToCalendar(${event.id})">Add to Calendar</button>
        </div>
    `;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeEventModal() {
    const modal = document.getElementById('eventModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Register for event
function registerForEvent(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    alert(`Registration for "${event.title}" has been recorded. You will receive a confirmation email shortly.`);
    closeEventModal();
}

// Add to calendar
function addToCalendar(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    alert(`"${event.title}" has been added to your calendar.`);
}

// Initialize events page
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('eventsGrid')) {
        renderEvents(eventsData);
        
        // Setup filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                filterEvents(this.dataset.filter);
            });
        });
        
        // Close modal when clicking outside
        const modal = document.getElementById('eventModal');
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeEventModal();
                }
            });
        }
    }
});

// ===== FACULTY DATA AND SEARCH =====
const facultyData = [
    {
        id: 1,
        name: 'Dr. Maria Santos',
        title: 'Dean, College of Computer Studies',
        department: 'Administration',
        specialization: 'Computer Science Education, Artificial Intelligence',
        email: 'm.santos@ccs.edu.ph',
        phone: '+63 2 1234 5601',
        image: 'avatar1'
    },
    {
        id: 2,
        name: 'Prof. Juan dela Cruz',
        title: 'Program Chair, BS Computer Science',
        department: 'Computer Science',
        specialization: 'Algorithms, Data Structures, Software Engineering',
        email: 'j.delacruz@ccs.edu.ph',
        phone: '+63 2 1234 5602',
        image: 'avatar2'
    },
    {
        id: 3,
        name: 'Dr. Lisa Chen',
        title: 'Associate Professor',
        department: 'Artificial Intelligence',
        specialization: 'Machine Learning, Neural Networks, Computer Vision',
        email: 'l.chen@ccs.edu.ph',
        phone: '+63 2 1234 5603',
        image: 'avatar3'
    },
    {
        id: 4,
        name: 'Prof. Roberto Garcia',
        title: 'Assistant Professor',
        department: 'Cybersecurity',
        specialization: 'Network Security, Ethical Hacking, Cryptography',
        email: 'r.garcia@ccs.edu.ph',
        phone: '+63 2 1234 5604',
        image: 'avatar4'
    },
    {
        id: 5,
        name: 'Dr. Sarah Johnson',
        title: 'Professor',
        department: 'Information Technology',
        specialization: 'Database Systems, Web Development, Cloud Computing',
        email: 's.johnson@ccs.edu.ph',
        phone: '+63 2 1234 5605',
        image: 'avatar5'
    },
    {
        id: 6,
        name: 'Prof. Michael Torres',
        title: 'Assistant Professor',
        department: 'Data Science',
        specialization: 'Big Data Analytics, Statistical Computing, Visualization',
        email: 'm.torres@ccs.edu.ph',
        phone: '+63 2 1234 5606',
        image: 'avatar6'
    },
    {
        id: 7,
        name: 'Dr. Anna Rodriguez',
        title: 'Associate Professor',
        department: 'Software Engineering',
        specialization: 'Agile Development, DevOps, System Architecture',
        email: 'a.rodriguez@ccs.edu.ph',
        phone: '+63 2 1234 5607',
        image: 'avatar7'
    },
    {
        id: 8,
        name: 'Prof. David Kim',
        title: 'Assistant Professor',
        department: 'Computer Science',
        specialization: 'Operating Systems, Computer Networks, Parallel Computing',
        email: 'd.kim@ccs.edu.ph',
        phone: '+63 2 1234 5608',
        image: 'avatar8'
    },
    {
        id: 9,
        name: 'Dr. Elena Martinez',
        title: 'Professor',
        department: 'Artificial Intelligence',
        specialization: 'Natural Language Processing, Deep Learning, AI Ethics',
        email: 'e.martinez@ccs.edu.ph',
        phone: '+63 2 1234 5609',
        image: 'avatar9'
    },
    {
        id: 10,
        name: 'Prof. James Wilson',
        title: 'Associate Professor',
        department: 'Information Technology',
        specialization: 'Mobile Development, IoT, Human-Computer Interaction',
        email: 'j.wilson@ccs.edu.ph',
        phone: '+63 2 1234 5610',
        image: 'avatar10'
    }
];

// Search and filter faculty
function searchFaculty() {
    const searchInput = document.getElementById('facultySearch');
    const departmentFilter = document.getElementById('departmentFilter');
    
    if (!searchInput || !departmentFilter) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    const selectedDept = departmentFilter.value;
    
    let filteredFaculty = facultyData.filter(faculty => {
        const matchesSearch = faculty.name.toLowerCase().includes(searchTerm) ||
                            faculty.specialization.toLowerCase().includes(searchTerm) ||
                            faculty.title.toLowerCase().includes(searchTerm);
        
        const matchesDept = selectedDept === 'all' || faculty.department === selectedDept;
        
        return matchesSearch && matchesDept;
    });
    
    renderFaculty(filteredFaculty);
}

// Render faculty directory
function renderFaculty(faculty) {
    const container = document.getElementById('facultyGrid');
    if (!container) return;
    
    if (faculty.length === 0) {
        container.innerHTML = '<p class="no-results">No faculty members found matching your criteria.</p>';
        return;
    }
    
    container.innerHTML = faculty.map(member => `
        <div class="faculty-card">
            <div class="faculty-avatar">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="50" fill="#1a1a2e"/>
                    <circle cx="50" cy="35" r="15" fill="#e94560"/>
                    <path d="M 30 65 Q 50 55 70 65 L 70 100 L 30 100 Z" fill="#e94560"/>
                    <text x="50" y="90" font-family="JetBrains Mono" font-size="10" fill="#fff" text-anchor="middle">${member.name.split(' ')[0][0]}${member.name.split(' ')[member.name.split(' ').length - 1][0]}</text>
                </svg>
            </div>
            <div class="faculty-info">
                <h3 class="faculty-name">${member.name}</h3>
                <p class="faculty-title">${member.title}</p>
                <p class="faculty-dept">${member.department}</p>
                <p class="faculty-spec"><strong>Specialization:</strong> ${member.specialization}</p>
                <div class="faculty-contact">
                    <p>📧 ${member.email}</p>
                    <p>📞 ${member.phone}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// Initialize faculty page
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('facultyGrid')) {
        renderFaculty(facultyData);
        
        const searchInput = document.getElementById('facultySearch');
        const departmentFilter = document.getElementById('departmentFilter');
        
        if (searchInput) {
            searchInput.addEventListener('input', searchFaculty);
        }
        
        if (departmentFilter) {
            departmentFilter.addEventListener('change', searchFaculty);
        }
    }
});

// ===== CONTACT FORM VALIDATION =====
function validateContactForm(event) {
    event.preventDefault();
    
    const name = document.getElementById('contactName');
    const email = document.getElementById('contactEmail');
    const subject = document.getElementById('contactSubject');
    const message = document.getElementById('contactMessage');
    
    let isValid = true;
    let errors = [];
    
    // Name validation
    if (name.value.trim().length < 2) {
        errors.push('Please enter a valid name (at least 2 characters)');
        name.classList.add('error');
        isValid = false;
    } else {
        name.classList.remove('error');
    }
    
    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value.trim())) {
        errors.push('Please enter a valid email address');
        email.classList.add('error');
        isValid = false;
    } else {
        email.classList.remove('error');
    }
    
    // Subject validation
    if (subject.value.trim().length < 5) {
        errors.push('Subject must be at least 5 characters long');
        subject.classList.add('error');
        isValid = false;
    } else {
        subject.classList.remove('error');
    }
    
    // Message validation
    if (message.value.trim().length < 10) {
        errors.push('Message must be at least 10 characters long');
        message.classList.add('error');
        isValid = false;
    } else {
        message.classList.remove('error');
    }
    
    if (!isValid) {
        showFormErrors(errors);
        return false;
    }
    
    // Form is valid - show success message
    showFormSuccess();
    
    // Store submission in localStorage
    const submission = {
        name: name.value.trim(),
        email: email.value.trim(),
        subject: subject.value.trim(),
        message: message.value.trim(),
        timestamp: new Date().toISOString()
    };
    
    const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    submissions.push(submission);
    localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
    
    // Reset form
    document.getElementById('contactForm').reset();
    
    return false;
}

function showFormErrors(errors) {
    const errorContainer = document.getElementById('formErrors');
    if (!errorContainer) return;
    
    errorContainer.innerHTML = `
        <div class="error-message">
            <strong>Please correct the following errors:</strong>
            <ul>${errors.map(error => `<li>${error}</li>`).join('')}</ul>
        </div>
    `;
    errorContainer.style.display = 'block';
    
    setTimeout(() => {
        errorContainer.style.display = 'none';
    }, 5000);
}

function showFormSuccess() {
    const successContainer = document.getElementById('formSuccess');
    if (!successContainer) return;
    
    successContainer.innerHTML = `
        <div class="success-message">
            <strong>✓ Message sent successfully!</strong>
            <p>Thank you for contacting us. We will respond to your inquiry within 24-48 hours.</p>
        </div>
    `;
    successContainer.style.display = 'block';
    
    setTimeout(() => {
        successContainer.style.display = 'none';
    }, 5000);
}

// Initialize contact form
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', validateContactForm);
    }
});

// ===== PROGRAMS PAGE - INTERACTIVE TABS/ACCORDION =====
function showProgramDetails(programId) {
    const allDetails = document.querySelectorAll('.program-details');
    const allButtons = document.querySelectorAll('.program-tab');
    
    allDetails.forEach(detail => {
        detail.classList.remove('active');
    });
    
    allButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    const selectedDetail = document.getElementById(programId);
    const selectedButton = document.querySelector(`[data-program="${programId}"]`);
    
    if (selectedDetail) {
        selectedDetail.classList.add('active');
    }
    
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
}

// Initialize programs page
document.addEventListener('DOMContentLoaded', function() {
    const programTabs = document.querySelectorAll('.program-tab');
    programTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            showProgramDetails(this.dataset.program);
        });
    });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== PAGE LOAD ANIMATION =====
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

console.log('College of Computer Studies - Website Loaded Successfully');