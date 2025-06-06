
let currentSection = 'dashboard-section';
let targetSection = '';
let saveModal = null;
let sectionChanged = {};

document.addEventListener("DOMContentLoaded", function () {
    showSection("dashboard-section");
    setActiveSidebar("dashboard-section");
    saveModal = new bootstrap.Modal(document.getElementById('saveConfirmationModal'));
    initializeChangeTracking();
});

function initializeChangeTracking() {
    document.querySelectorAll('#main-content > div').forEach(section => {
        const sectionId = section.classList[0];
        sectionChanged[sectionId] = false;

        const inputs = section.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                sectionChanged[sectionId] = true;
            });
        });
    });
}

document.querySelectorAll('.sidebar a[data-section]').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const section = this.getAttribute('data-section');
        navigateWithModal(section);
    });
});

function showSection(sectionId) {
    document.querySelectorAll('#main-content > div').forEach(section => {
        section.style.display = 'none';
    });
    const targetSection = document.querySelector(`#main-content .${sectionId}`);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
    currentSection = sectionId;
}

function setActiveSidebar(sectionId) {
    document.querySelectorAll('.sidebar a[data-section]').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        }
    });
}

function navigateWithModal(sectionId) {
    if (sectionChanged[currentSection]) {
        targetSection = sectionId;
        saveModal.show();
    } else {
        navigateToSection(sectionId);
    }
}

function navigateToSection(sectionId) {
    showSection(sectionId);
    setActiveSidebar(sectionId);

    const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('offcanvasSidebar'));
    if (offcanvas) offcanvas.hide();
}

function saveAndProceed() {
    saveSection(currentSection);
    saveModal.hide();
    navigateToSection(targetSection);
}

function proceedWithoutSaving() {
    sectionChanged[currentSection] = false;
    saveModal.hide();
    navigateToSection(targetSection);
}

function saveSection(sectionId) {
    sectionChanged[sectionId] = false;
    console.log(`Saving data for ${sectionId}`);
}

// function clearSection(sectionId) {
//     const section = document.querySelector(`#main-content .${sectionId}`);
//     const inputs = section.querySelectorAll('input, select, textarea');
//     const previewContainers = section.querySelectorAll('.picture-box, .multi-picture-box-container');

//     inputs.forEach(input => {
//         if (input.type === 'checkbox') {
//             input.checked = false;
//         } else if (input.tagName === 'SELECT') {
//             input.selectedIndex = 0;
//         } else {
//             input.value = '';
//         }
//     });

//     previewContainers.forEach(container => {
//         container.innerHTML = '';
//         if (container.id.includes('Preview') && !container.id.includes('roomsPreview') &&
//             !container.id.includes('bathroomsPreview') && !container.id.includes('commonAreasPreview') &&
//             !container.id.includes('diningAreaPreview') && !container.id.includes('exteriorInteriorPreview')) {
//             container.classList.add('picture-box-placeholder');
//         }
//     });

//     sectionChanged[sectionId] = false;
//     console.log(`Cleared data for ${sectionId}`);
// }

function previewImage(input, previewId, isMultiple) {
    const preview = document.getElementById(previewId);
    preview.innerHTML = ''; // Clear existing preview

    if (input.files && input.files.length > 0) {
        preview.classList.remove('picture-box-placeholder');
        if (isMultiple) {
            Array.from(input.files).forEach(file => {
                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                img.style.maxWidth = '100px';
                img.style.margin = '5px';
                preview.appendChild(img);
            });
        } else {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(input.files[0]);
            img.style.maxWidth = '100%';
            img.style.maxHeight = '150px';
            preview.appendChild(img);
        }
    } else {
        preview.classList.add('picture-box-placeholder');
    }
}

function removeImage(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    input.value = ''; // Clear the file input
    preview.innerHTML = ''; // Clear the preview
    preview.classList.add('picture-box-placeholder');
    // Clear any associated error message
    const errorElement = document.getElementById(`${inputId}Error`);
    if (errorElement) errorElement.textContent = '';
}


function validateAndSaveSection(sectionId) {
    // Clear previous error messages
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

    // Get form elements
    const hostelName = document.getElementById('hostelName').value.trim();
    const hostelType = document.getElementById('hostelType').value;
    const ownerName = document.getElementById('ownerName').value.trim();
    const contactNumber = document.getElementById('contactNumber').value.trim();
    const emailAddress = document.getElementById('emailAddress').value.trim();

    const fullAddress = document.getElementById('fullAddress').value.trim();
    const city = document.getElementById('city').value.trim();
    const landmarks = document.getElementById('landmarks').value.trim();
    const distance = document.getElementById('distance').value.trim();
    const directions = document.getElementById('directions').value.trim();

    const overview = document.getElementById('overview').value.trim();
    const hostelRules = document.getElementById('hostelRules').value.trim();
    const checkInTime = document.getElementById('checkInTime').value;
    const checkOutTime = document.getElementById('checkOutTime').value;
    const securityFeatures = document.getElementById('securityFeatures').value.trim();

    const roomTypes = document.getElementById('roomTypes').selectedOptions;

    const checkboxes = document.querySelectorAll('.facilities-section .form-check-input');
    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;

    const frontView = document.getElementById('frontView');
    const rooms = document.getElementById('rooms');
    const bathrooms = document.getElementById('bathrooms');
    const commonAreas = document.getElementById('commonAreas');
    const diningArea = document.getElementById('diningArea');
    const exteriorInterior = document.getElementById('exteriorInterior');

    const minBookingDuration = document.getElementById('minBookingDuration').value.trim();
    const minBookingUnit = document.getElementById('minBookingUnit').value;
    const advancePayment = document.getElementById('advancePayment').value.trim();
    const advancePaymentUnit = document.getElementById('advancePaymentUnit').value.trim();
    const refundPolicy = document.getElementById('refundPolicy').value.trim();
    const onlinePayment = document.getElementById('onlinePayment').value;

    const acceptingBookings = document.getElementById('acceptingBookings').value;
    const availableFrom = document.getElementById('availableFrom').value;

    // Current date for comparison (June 06, 2025)
    const today = new Date('2025-06-06');
    today.setHours(0, 0, 0, 0); // Normalize to start of day


    // Validation patterns
    const phonePattern = /^\+?[\d\s-]{10,}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const distancePattern = /^\d+(\.\d{1,2})?\s*(km|m)$/i;
    const pricingPattern = /^\d+(\.\d{1,2})?$/;
    const paymentPattern = /^\d+(\.\d{1,2})?$/;
    const currencyPattern = /^[A-Za-z]{2,10}$/;



    // Track validation status
    let isValid = true;

    // Validation checks
    if (!hostelName) {
        document.getElementById('hostelNameError').textContent = "Hostel Name is required";
        isValid = false;
    }

    if (hostelType === "--Select Hostel Type --") {
        document.getElementById('hostelTypeError').textContent = "Please select a Hostel Type";
        isValid = false;
    }

    if (!ownerName) {
        document.getElementById('ownerNameError').textContent = "Owner Name is required";
        isValid = false;
    }

    if (!contactNumber) {
        document.getElementById('contactNumberError').textContent = "Contact Number is required";
        isValid = false;
    } else if (!phonePattern.test(contactNumber)) {
        document.getElementById('contactNumberError').textContent = "Please enter a valid phone number";
        isValid = false;
    }

    if (!emailAddress) {
        document.getElementById('emailAddressError').textContent = "Email Address is required";
        isValid = false;
    } else if (!emailPattern.test(emailAddress)) {
        document.getElementById('emailAddressError').textContent = "Please enter a valid email address";
        isValid = false;
    }

    if (!fullAddress) {
        document.getElementById('fullAddressError').textContent = "Full Address is required";
        isValid = false;
    }

    if (!city) {
        document.getElementById('cityError').textContent = "City is required";
        isValid = false;
    }

    if (landmarks && landmarks.length < 3) {
        document.getElementById('landmarksError').textContent = "Landmarks must be at least 3 characters if provided";
        isValid = false;
    }

    if (distance && !distancePattern.test(distance)) {
        document.getElementById('distanceError').textContent = "Please enter a valid distance (e.g., 1.2 km or 500 m)";
        isValid = false;
    }

    if (directions && directions.length < 10) {
        document.getElementById('directionsError').textContent = "Directions must be at least 10 characters if provided";
        isValid = false;
    }

    if (!overview) {
        document.getElementById('overviewError').textContent = "Overview is required";
        isValid = false;
    } else if (overview.length < 10) {
        document.getElementById('overviewError').textContent = "Overview must be at least 10 characters";
        isValid = false;
    }

    if (!hostelRules) {
        document.getElementById('hostelRulesError').textContent = "Hostel Rules are required";
        isValid = false;
    } else if (hostelRules.length < 10) {
        document.getElementById('hostelRulesError').textContent = "Hostel Rules must be at least 10 characters";
        isValid = false;
    }

    if (!checkInTime) {
        document.getElementById('checkInTimeError').textContent = "Check-in Time is required";
        isValid = false;
    }

    if (!checkOutTime) {
        document.getElementById('checkOutTimeError').textContent = "Check-out Time is required";
        isValid = false;
    }

    if (!securityFeatures) {
        document.getElementById('securityFeaturesError').textContent = "Security Features are required";
        isValid = false;
    } else if (securityFeatures.length < 5) {
        document.getElementById('securityFeaturesError').textContent = "Security Features must be at least 5 characters";
        isValid = false;
    }


    // Validate Minimum Booking Duration
    if (!minBookingDuration) {
        document.getElementById('minBookingDurationError').textContent = "Minimum Booking Duration is required";
        isValid = false;
    } else if (!/^\d+$/.test(minBookingDuration) || parseInt(minBookingDuration) <= 0) {
        document.getElementById('minBookingDurationError').textContent = "Please enter a valid positive number for duration";
        isValid = false;
    }

    if (!minBookingUnit) {
        document.getElementById('minBookingDurationError').textContent = "Please select a unit for Minimum Booking Duration";
        isValid = false;
    }

    // Validate Advance Payment
    if (!advancePayment) {
        document.getElementById('advancePaymentError').textContent = "Advance Payment amount is required";
        isValid = false;
    } else if (!paymentPattern.test(advancePayment)) {
        document.getElementById('advancePaymentError').textContent = "Please enter a valid amount (e.g., 1000 or 1000.50)";
        isValid = false;
    }

    if (!advancePaymentUnit) {
        document.getElementById('advancePaymentError').textContent = "Currency unit is required (e.g., USD, KES)";
        isValid = false;
    } else if (!currencyPattern.test(advancePaymentUnit)) {
        document.getElementById('advancePaymentError').textContent = "Please enter a valid currency unit (e.g., USD, KES)";
        isValid = false;
    }

    // Validate Refund Policy
    if (!refundPolicy) {
        document.getElementById('refundPolicyError').textContent = "Refund Policy is required";
        isValid = false;
    } else if (refundPolicy.length < 10) {
        document.getElementById('refundPolicyError').textContent = "Refund Policy must be at least 10 characters";
        isValid = false;
    }

    // Validate Online Payment Option
    if (!onlinePayment) {
        document.getElementById('onlinePaymentError').textContent = "Please select an option for Online Payment";
        isValid = false;
    }

    // Validate Currently Accepting Bookings
    if (!acceptingBookings) {
        document.getElementById('acceptingBookingsError').textContent = "Please select an option for accepting bookings";
        isValid = false;
    }

    // Validate Available From
    if (!availableFrom) {
        document.getElementById('availableFromError').textContent = "Available From date is required";
        isValid = false;
    } else {
        const selectedDate = new Date(availableFrom);
        if (selectedDate < today) {
            document.getElementById('availableFromError').textContent = "Available From date cannot be in the past";
            isValid = false;
        }
    }

    // Validate inputs for each selected room type
    Array.from(roomTypes).forEach(option => {
        const type = option.value;
        const typeId = type.replace(/\s+/g, '_');
        const pricing = document.getElementById(`pricing_${typeId}`).value.trim();
        const availability = document.getElementById(`availability_${typeId}`).value;
        const furnishing = document.getElementById(`furnishing_${typeId}`).value.trim();

        if (!pricing) {
            document.getElementById(`pricingError_${typeId}`).textContent = `Pricing for ${type} is required`;
            isValid = false;
        } else if (!pricingPattern.test(pricing)) {
            document.getElementById(`pricingError_${typeId}`).textContent = `Please enter a valid price for ${type} (e.g., 1000 or 1000.50)`;
            isValid = false;
        }

        if (availability === '') {
            document.getElementById(`availabilityError_${typeId}`).textContent = `Availability Count for ${type} is required`;
            isValid = false;
        } else if (parseInt(availability) < 0) {
            document.getElementById(`availabilityError_${typeId}`).textContent = `Availability Count for ${type} cannot be negative`;
            isValid = false;
        }

        if (!furnishing) {
            document.getElementById(`furnishingError_${typeId}`).textContent = `Furnishing details for ${type} are required`;
            isValid = false;
        } else if (furnishing.length < 10) {
            document.getElementById(`furnishingError_${typeId}`).textContent = `Furnishing details for ${type} must be at least 10 characters`;
            isValid = false;
        }
    });

    if (checkedCount === 0) {
        document.getElementById('facilitiesError').textContent = "At least one facility must be selected";
        isValid = false;
    }

    // Validate Front View (required)
    if (!frontView.files || frontView.files.length === 0) {
        document.getElementById('frontViewError').textContent = "At least one Front View image is required";
        isValid = false;
    } else if (!frontView.files[0].type.startsWith('image/')) {
        document.getElementById('frontViewError').textContent = "Only image files are allowed for Front View";
        isValid = false;
    }

    // Validate optional sections (if files are selected, ensure they are images)
    const optionalInputs = [
        { input: rooms, id: 'rooms', label: 'Rooms' },
        { input: bathrooms, id: 'bathrooms', label: 'Bathrooms' },
        { input: commonAreas, id: 'commonAreas', label: 'Common Areas' },
        { input: diningArea, id: 'diningArea', label: 'Dining Area' },
        { input: exteriorInterior, id: 'exteriorInterior', label: 'Building Exterior/Interior' }
    ];

    optionalInputs.forEach(({ input, id, label }) => {
        if (input.files && input.files.length > 0) {
            Array.from(input.files).forEach(file => {
                if (!file.type.startsWith('image/')) {
                    document.getElementById(`${id}Error`).textContent = `Only image files are allowed for ${label}`;
                    isValid = false;
                }
            });
        }
    });






    // Proceed with save if all validations pass
    if (isValid) {
        saveSection(sectionId);
    }
}

function updateDynamicInputs() {
    const roomTypesSelect = document.getElementById('roomTypes');
    const dynamicRoomInputs = document.getElementById('dynamicRoomInputs');
    dynamicRoomInputs.innerHTML = ''; // Clear existing inputs

    const selectedTypes = Array.from(roomTypesSelect.selectedOptions).map(option => option.value);

    selectedTypes.forEach(type => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'room-type-group';
        groupDiv.innerHTML = `
            <h5>${type}</h5>
            <div class="row g-3">
                <div class="col-md-6">
                    <label class="form-label">Pricing for ${type}</label>
                    <input type="text" class="form-control" id="pricing_${type.replace(/\s+/g, '_')}" placeholder="e.g., 1000 or 1000.50">
                    <div class="error-message text-danger" id="pricingError_${type.replace(/\s+/g, '_')}"></div>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Availability Count for ${type}</label>
                    <input type="number" class="form-control" id="availability_${type.replace(/\s+/g, '_')}" min="0">
                    <div class="error-message text-danger" id="availabilityError_${type.replace(/\s+/g, '_')}"></div>
                </div>
                <div class="col-12">
                    <label class="form-label">##

Furnishing for ${type}</label>
                    <textarea class="form-control" id="furnishing_${type.replace(/\s+/g, '_')}" rows="2" placeholder="e.g., bed, mattress, study table, cupboard, fan"></textarea>
                    <div class="error-message text-danger" id="furnishingError_${type.replace(/\s+/g, '_')}"></div>
                </div>
            </div>
        `;
        dynamicRoomInputs.appendChild(groupDiv);
    });
}

function clearSection(sectionId) {
    const section = document.querySelector(`.${sectionId}`);
    const selects = section.querySelectorAll('select');
    const dynamicRoomInputs = document.getElementById('dynamicRoomInputs');
    const errorMessages = section.querySelectorAll('.error-message');
    const checkboxes = section.querySelectorAll('.form-check-input');
    const previews = section.querySelectorAll('.picture-box, .multi-picture-box-container');

    selects.forEach(select => {
        for (let option of select.options) {
            option.selected = false;
        }
    });

    inputs.forEach(input => input.value = '');
    previews.forEach(preview => {
        preview.innerHTML = '';
        preview.classList.add('picture-box-placeholder');
    });

    dynamicRoomInputs.innerHTML = ''; // Clear dynamic inputs
    checkboxes.forEach(cb => cb.checked = false);
    errorMessages.forEach(error => error.textContent = '');
}

// Add event listener to update dynamic inputs when room types are selected
document.getElementById('roomTypes').addEventListener('change', updateDynamicInputs);

function clearSection(sectionId) {
    const section = document.querySelector(`.${sectionId}`);
    const inputs = section.querySelectorAll('input');
    const previews = section.querySelectorAll('.picture-box, .multi-picture-box-container');
    const selects = section.querySelectorAll('select');
    const textareas = section.querySelectorAll('textarea');
    const errorMessages = section.querySelectorAll('.error-message');

    inputs.forEach(input => input.value = '');
    previews.forEach(preview => {
        preview.innerHTML = '';
        preview.classList.add('picture-box-placeholder');
    });
    selects.forEach(select => select.selectedIndex = 0);
    textareas.forEach(textarea => textarea.value = '');
    errorMessages.forEach(error => error.textContent = '');
}

