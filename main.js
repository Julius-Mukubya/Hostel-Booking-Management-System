
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

function clearSection(sectionId) {
    const section = document.querySelector(`#main-content .${sectionId}`);
    const inputs = section.querySelectorAll('input, select, textarea');
    const previewContainers = section.querySelectorAll('.picture-box, .multi-picture-box-container');

    inputs.forEach(input => {
        if (input.type === 'checkbox') {
            input.checked = false;
        } else if (input.tagName === 'SELECT') {
            input.selectedIndex = 0;
        } else {
            input.value = '';
        }
    });

    previewContainers.forEach(container => {
        container.innerHTML = '';
        if (container.id.includes('Preview') && !container.id.includes('roomsPreview') &&
            !container.id.includes('bathroomsPreview') && !container.id.includes('commonAreasPreview') &&
            !container.id.includes('diningAreaPreview') && !container.id.includes('exteriorInteriorPreview')) {
            container.classList.add('picture-box-placeholder');
        }
    });

    sectionChanged[sectionId] = false;
    console.log(`Cleared data for ${sectionId}`);
}

function previewImage(input, previewContainerId, isMultiple) {
    const previewContainer = document.getElementById(previewContainerId);
    previewContainer.innerHTML = '';

    if (input.files && input.files.length > 0) {
        Array.from(input.files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function (e) {
                const pictureBox = document.createElement("div");
                pictureBox.className = "picture-box";
                const img = document.createElement("img");
                img.src = e.target.result;
                pictureBox.appendChild(img);
                previewContainer.appendChild(pictureBox);

                if (!isMultiple) {
                    previewContainer.classList.remove("picture-box-placeholder");
                }
            };
            reader.readAsDataURL(file);

            if (!isMultiple) {
                return;
            }
        });
        sectionChanged[currentSection] = true;
    } else {
        if (!isMultiple) {
            previewContainer.classList.add("picture-box-placeholder");
        }
    }
}
