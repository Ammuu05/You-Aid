// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        }
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    document.querySelectorAll('.about-card, .service-card, .care-home-card').forEach(el => {
        observer.observe(el);
    });
});

// Smooth scrolling function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Report Modal functionality
function openReportModal() {
    document.getElementById('report-modal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeReportModal() {
    document.getElementById('report-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function closeSuccessModal() {
    document.getElementById('success-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    const reportModal = document.getElementById('report-modal');
    const successModal = document.getElementById('success-modal');
    
    if (event.target === reportModal) {
        closeReportModal();
    }
    if (event.target === successModal) {
        closeSuccessModal();
    }
});

// Report form submission
function submitReport(event) {
    event.preventDefault();
    
    // Simulate form processing
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;
    
    setTimeout(() => {
        closeReportModal();
        
        // Generate reference ID
        const referenceId = 'YA' + Date.now().toString().slice(-6);
        document.getElementById('reference-id').textContent = referenceId;
        
        // Show success modal
        document.getElementById('success-modal').style.display = 'block';
        
        // Reset form
        event.target.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Store report in localStorage for demo purposes
        const reports = JSON.parse(localStorage.getItem('youaid-reports') || '[]');
        reports.push({
            id: referenceId,
            timestamp: new Date().toISOString(),
            status: 'submitted'
        });
        localStorage.setItem('youaid-reports', JSON.stringify(reports));
        
    }, 2000);
}

// Contact form submission
function submitContactForm(event) {
    event.preventDefault();
    
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    setTimeout(() => {
        alert('Thank you for your message! We will get back to you within 24 hours.');
        event.target.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 1500);
}

// Care homes data and functionality
const careHomesData = [
    {
        name: "Sunrise Senior Living",
        location: "Downtown District",
        address: "123 Main Street, City Center",
        phone: "(555) 123-4567",
        availability: "available",
        capacity: "45 residents",
        specialties: ["Memory Care", "Assisted Living", "Independent Living"],
        rating: 4.8
    },
    {
        name: "Golden Years Care Center",
        location: "Westside",
        address: "456 Oak Avenue, Westside",
        phone: "(555) 234-5678",
        availability: "limited",
        capacity: "32 residents",
        specialties: ["Skilled Nursing", "Rehabilitation", "Respite Care"],
        rating: 4.6
    },
    {
        name: "Harmony House",
        location: "Northbrook",
        address: "789 Pine Road, Northbrook",
        phone: "(555) 345-6789",
        availability: "available",
        capacity: "28 residents",
        specialties: ["Dementia Care", "Physical Therapy", "Social Activities"],
        rating: 4.9
    },
    {
        name: "Peaceful Meadows",
        location: "Southside",
        address: "321 Elm Street, Southside",
        phone: "(555) 456-7890",
        availability: "full",
        capacity: "50 residents",
        specialties: ["Long-term Care", "Palliative Care", "Family Support"],
        rating: 4.7
    },
    {
        name: "Comfort Care Villa",
        location: "East End",
        address: "654 Maple Drive, East End",
        phone: "(555) 567-8901",
        availability: "available",
        capacity: "38 residents",
        specialties: ["Assisted Living", "Medication Management", "Wellness Programs"],
        rating: 4.5
    },
    {
        name: "Serenity Gardens",
        location: "Riverside",
        address: "987 River View Lane, Riverside",
        phone: "(555) 678-9012",
        availability: "limited",
        capacity: "42 residents",
        specialties: ["Memory Care", "Therapeutic Gardens", "Pet Therapy"],
        rating: 4.8
    }
];

function showCareHomes() {
    const careHomesSection = document.getElementById('care-homes');
    careHomesSection.style.display = 'block';
    careHomesSection.scrollIntoView({ behavior: 'smooth' });
    
    // Load all care homes initially
    displayCareHomes(careHomesData);
}

function displayCareHomes(homes) {
    const careHomesList = document.getElementById('care-homes-list');
    
    if (homes.length === 0) {
        careHomesList.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No care homes found matching your search criteria.</p>';
        return;
    }
    
    careHomesList.innerHTML = homes.map(home => `
        <div class="care-home-card">
            <div class="care-home-header">
                <h3>${home.name}</h3>
                <span class="availability ${home.availability}">${getAvailabilityText(home.availability)}</span>
            </div>
            <div class="care-home-info">
                <p><strong>📍 Location:</strong> ${home.location}</p>
                <p><strong>📧 Address:</strong> ${home.address}</p>
                <p><strong>📞 Phone:</strong> ${home.phone}</p>
                <p><strong>👥 Capacity:</strong> ${home.capacity}</p>
                <p><strong>⭐ Rating:</strong> ${home.rating}/5.0</p>
                <div style="margin-top: 1rem;">
                    <strong>Specialties:</strong>
                    <div style="margin-top: 0.5rem;">
                        ${home.specialties.map(specialty => `<span style="display: inline-block; background: #e2e8f0; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; margin: 0.125rem;">${specialty}</span>`).join('')}
                    </div>
                </div>
            </div>
            <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                <button class="btn btn-primary" onclick="contactCareHome('${home.name}', '${home.phone}')">Contact</button>
                <button class="btn btn-outline" onclick="viewCareHomeDetails('${home.name}')">View Details</button>
            </div>
        </div>
    `).join('');
}

function getAvailabilityText(availability) {
    switch(availability) {
        case 'available': return 'Available';
        case 'limited': return 'Limited';
        case 'full': return 'Full';
        default: return 'Unknown';
    }
}

function searchCareHomes() {
    const searchTerm = document.getElementById('location-search').value.toLowerCase().trim();
    
    if (!searchTerm) {
        displayCareHomes(careHomesData);
        return;
    }
    
    const filteredHomes = careHomesData.filter(home => 
        home.name.toLowerCase().includes(searchTerm) ||
        home.location.toLowerCase().includes(searchTerm) ||
        home.address.toLowerCase().includes(searchTerm) ||
        home.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm))
    );
    
    displayCareHomes(filteredHomes);
}

function contactCareHome(name, phone) {
    if (confirm(`Would you like to call ${name} at ${phone}?`)) {
        window.location.href = `tel:${phone}`;
    }
}

function viewCareHomeDetails(name) {
    const home = careHomesData.find(h => h.name === name);
    if (home) {
        alert(`${home.name}\n\nLocation: ${home.location}\nAddress: ${home.address}\nPhone: ${home.phone}\nCapacity: ${home.capacity}\nRating: ${home.rating}/5.0\n\nSpecialties:\n${home.specialties.join('\n')}\n\nAvailability: ${getAvailabilityText(home.availability)}`);
    }
}

// Search functionality with Enter key
document.addEventListener('DOMContentLoaded', function() {
    const locationSearch = document.getElementById('location-search');
    if (locationSearch) {
        locationSearch.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                searchCareHomes();
            }
        });
    }
});

// Utility functions for demo purposes
function generateReferenceId() {
    return 'YA' + Math.random().toString(36).substr(2, 6).toUpperCase();
}

// Add some interactive feedback
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add loading states to forms
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function() {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn && !submitBtn.disabled) {
                submitBtn.style.opacity = '0.7';
                submitBtn.style.cursor = 'not-allowed';
            }
        });
    });
});

// Emergency contact functionality
function callEmergencyHotline() {
    if (confirm('Call YouAid Emergency Hotline?\n1-800-YOUAID-1 (1-800-968-2431)')) {
        window.location.href = 'tel:1-800-968-2431';
    }
}

// Add emergency hotline to contact items
document.addEventListener('DOMContentLoaded', function() {
    const emergencyItems = document.querySelectorAll('.contact-item');
    emergencyItems.forEach(item => {
        if (item.textContent.includes('Emergency Hotline')) {
            item.style.cursor = 'pointer';
            item.addEventListener('click', callEmergencyHotline);
        }
    });
});