// API Configuration
const API_BASE = 'http://127.0.0.1:8000/api';

// State Management
let currentUser = null;
let accessToken = localStorage.getItem('accessToken');
let refreshToken = localStorage.getItem('refreshToken');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    if (accessToken) {
        showDashboard();
        loadDashboardData();
    } else {
        showLogin();
    }
});

// Authentication Functions
async function login(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_BASE}/auth/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            accessToken = data.data.access;
            refreshToken = data.data.refresh;
            currentUser = data.data.user;
            
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            showMessage('Login successful!', 'success');
            showDashboard();
            loadDashboardData();
        } else {
            // Show detailed error message
            let errorMessage = 'Login failed';
            if (data.errors && data.errors.non_field_errors) {
                errorMessage = data.errors.non_field_errors[0];
            } else if (data.errors && data.errors.email) {
                errorMessage = `Email error: ${data.errors.email[0]}`;
            } else if (data.errors && data.errors.password) {
                errorMessage = `Password error: ${data.errors.password[0]}`;
            } else if (data.message) {
                errorMessage = data.message;
            }
            showMessage(errorMessage, 'error');
        }
    } catch (error) {
        showMessage('Network error. Please check your connection and try again.', 'error');
    }
}

async function register(event) {
    event.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch(`${API_BASE}/auth/register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (data.success) {
            showMessage('Registration successful! Please login.', 'success');
            showLogin();
        } else {
            // Show detailed error message
            let errorMessage = 'Registration failed';
            if (data.errors && data.errors.email) {
                errorMessage = `Email error: ${data.errors.email[0]}`;
            } else if (data.errors && data.errors.password) {
                errorMessage = `Password error: ${data.errors.password[0]}`;
            } else if (data.errors && data.errors.name) {
                errorMessage = `Name error: ${data.errors.name[0]}`;
            } else if (data.message) {
                errorMessage = data.message;
            }
            showMessage(errorMessage, 'error');
        }
    } catch (error) {
        showMessage('Network error. Please check your connection and try again.', 'error');
    }
}

function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    accessToken = null;
    refreshToken = null;
    currentUser = null;
    
    showMessage('Logged out successfully', 'info');
    showLogin();
}

// Navigation Functions
function showLogin() {
    hideAllPages();
    hideNavbar();
    document.getElementById('loginPage').style.display = 'block';
}

function showRegister() {
    hideAllPages();
    hideNavbar();
    document.getElementById('registerPage').style.display = 'block';
}

function showDashboard() {
    hideAllPages();
    showNavbar();
    document.getElementById('dashboardPage').style.display = 'block';
    loadDashboardData();
}

function showPatients() {
    hideAllPages();
    showNavbar();
    document.getElementById('patientsPage').style.display = 'block';
    loadPatients();
}

function showDoctors() {
    hideAllPages();
    showNavbar();
    document.getElementById('doctorsPage').style.display = 'block';
    loadDoctors();
}

function showMappings() {
    hideAllPages();
    showNavbar();
    document.getElementById('mappingsPage').style.display = 'block';
    loadMappings();
}

function hideAllPages() {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.style.display = 'none');
}

function showNavbar() {
    document.getElementById('navbar').style.display = 'block';
}

function hideNavbar() {
    document.getElementById('navbar').style.display = 'none';
}

// Dashboard Functions
async function loadDashboardData() {
    try {
        const [patientsResponse, doctorsResponse, mappingsResponse] = await Promise.all([
            fetchWithAuth(`${API_BASE}/patients/`),
            fetchWithAuth(`${API_BASE}/doctors/`),
            fetchWithAuth(`${API_BASE}/mappings/`)
        ]);

        const patients = await patientsResponse.json();
        const doctors = await doctorsResponse.json();
        const mappings = await mappingsResponse.json();

        document.getElementById('totalPatients').textContent = patients.count || 0;
        document.getElementById('totalDoctors').textContent = doctors.count || 0;
        document.getElementById('totalMappings').textContent = mappings.count || 0;
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Patient Functions
async function loadPatients() {
    try {
        const response = await fetchWithAuth(`${API_BASE}/patients/`);
        const data = await response.json();
        
        if (data.success) {
            displayPatients(data.results);
        }
    } catch (error) {
        showMessage('Error loading patients', 'error');
    }
}

function displayPatients(patients) {
    const container = document.getElementById('patientsList');
    container.innerHTML = '';

    if (patients.length === 0) {
        container.innerHTML = '<p>No patients found.</p>';
        return;
    }

    patients.forEach(patient => {
        const patientDiv = document.createElement('div');
        patientDiv.className = 'list-item';
        patientDiv.innerHTML = `
            <h4>${patient.full_name}</h4>
            <p><strong>Age:</strong> ${patient.age}</p>
            <p><strong>Gender:</strong> ${patient.gender}</p>
            <p><strong>Phone:</strong> ${patient.phone}</p>
            <p><strong>Address:</strong> ${patient.address}</p>
            ${patient.medical_history ? `<p><strong>Medical History:</strong> ${patient.medical_history}</p>` : ''}
            <p><strong>Created:</strong> ${new Date(patient.created_at).toLocaleDateString()}</p>
            <div class="actions">
                <button onclick="editPatient(${patient.id})" class="btn-secondary">Edit</button>
                <button onclick="deletePatient(${patient.id})" class="btn-danger">Delete</button>
            </div>
        `;
        container.appendChild(patientDiv);
    });
}

function showAddPatientForm() {
    document.getElementById('patientForm').style.display = 'block';
}

function hidePatientForm() {
    document.getElementById('patientForm').style.display = 'none';
    document.getElementById('addPatientForm').reset();
}

async function addPatient(event) {
    event.preventDefault();
    
    const patientData = {
        full_name: document.getElementById('patientName').value,
        age: parseInt(document.getElementById('patientAge').value),
        gender: document.getElementById('patientGender').value,
        phone: document.getElementById('patientPhone').value,
        address: document.getElementById('patientAddress').value,
        medical_history: document.getElementById('patientMedicalHistory').value
    };

    try {
        const response = await fetchWithAuth(`${API_BASE}/patients/`, {
            method: 'POST',
            body: JSON.stringify(patientData)
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Patient added successfully!', 'success');
            hidePatientForm();
            loadPatients();
        } else {
            showMessage(data.message || 'Failed to add patient', 'error');
        }
    } catch (error) {
        showMessage('Error adding patient', 'error');
    }
}

async function deletePatient(id) {
    if (!confirm('Are you sure you want to delete this patient?')) return;

    try {
        const response = await fetchWithAuth(`${API_BASE}/patients/${id}/`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showMessage('Patient deleted successfully!', 'success');
            loadPatients();
        } else {
            showMessage('Failed to delete patient', 'error');
        }
    } catch (error) {
        showMessage('Error deleting patient', 'error');
    }
}

// Doctor Functions
async function loadDoctors() {
    try {
        const response = await fetchWithAuth(`${API_BASE}/doctors/`);
        const data = await response.json();
        
        if (data.success) {
            displayDoctors(data.results);
        }
    } catch (error) {
        showMessage('Error loading doctors', 'error');
    }
}

function displayDoctors(doctors) {
    const container = document.getElementById('doctorsList');
    container.innerHTML = '';

    if (doctors.length === 0) {
        container.innerHTML = '<p>No doctors found.</p>';
        return;
    }

    doctors.forEach(doctor => {
        const doctorDiv = document.createElement('div');
        doctorDiv.className = 'list-item';
        doctorDiv.innerHTML = `
            <h4>${doctor.full_name}</h4>
            <p><strong>Specialization:</strong> ${doctor.specialization}</p>
            <p><strong>Email:</strong> ${doctor.email}</p>
            <p><strong>Phone:</strong> ${doctor.phone}</p>
            <p><strong>Hospital:</strong> ${doctor.hospital_name}</p>
            <p><strong>Experience:</strong> ${doctor.years_of_experience} years</p>
            <p><strong>Created:</strong> ${new Date(doctor.created_at).toLocaleDateString()}</p>
            <div class="actions">
                <button onclick="editDoctor(${doctor.id})" class="btn-secondary">Edit</button>
                <button onclick="deleteDoctor(${doctor.id})" class="btn-danger">Delete</button>
            </div>
        `;
        container.appendChild(doctorDiv);
    });
}

function showAddDoctorForm() {
    document.getElementById('doctorForm').style.display = 'block';
}

function hideDoctorForm() {
    document.getElementById('doctorForm').style.display = 'none';
    document.getElementById('addDoctorForm').reset();
}

async function addDoctor(event) {
    event.preventDefault();
    
    const doctorData = {
        full_name: document.getElementById('doctorName').value,
        specialization: document.getElementById('doctorSpecialization').value,
        email: document.getElementById('doctorEmail').value,
        phone: document.getElementById('doctorPhone').value,
        hospital_name: document.getElementById('doctorHospital').value,
        years_of_experience: parseInt(document.getElementById('doctorExperience').value)
    };

    try {
        const response = await fetchWithAuth(`${API_BASE}/doctors/`, {
            method: 'POST',
            body: JSON.stringify(doctorData)
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Doctor added successfully!', 'success');
            hideDoctorForm();
            loadDoctors();
        } else {
            showMessage(data.message || 'Failed to add doctor', 'error');
        }
    } catch (error) {
        showMessage('Error adding doctor', 'error');
    }
}

async function deleteDoctor(id) {
    if (!confirm('Are you sure you want to delete this doctor?')) return;

    try {
        const response = await fetchWithAuth(`${API_BASE}/doctors/${id}/`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showMessage('Doctor deleted successfully!', 'success');
            loadDoctors();
        } else {
            showMessage('Failed to delete doctor', 'error');
        }
    } catch (error) {
        showMessage('Error deleting doctor', 'error');
    }
}

// Mapping Functions
async function loadMappings() {
    try {
        const [mappingsResponse, patientsResponse, doctorsResponse] = await Promise.all([
            fetchWithAuth(`${API_BASE}/mappings/`),
            fetchWithAuth(`${API_BASE}/patients/`),
            fetchWithAuth(`${API_BASE}/doctors/`)
        ]);

        const mappings = await mappingsResponse.json();
        const patients = await patientsResponse.json();
        const doctors = await doctorsResponse.json();

        if (mappings.success) {
            displayMappings(mappings.results);
            populateMappingSelects(patients.results, doctors.results);
        }
    } catch (error) {
        showMessage('Error loading mappings', 'error');
    }
}

function displayMappings(mappings) {
    const container = document.getElementById('mappingsList');
    container.innerHTML = '';

    if (mappings.length === 0) {
        container.innerHTML = '<p>No mappings found.</p>';
        return;
    }

    mappings.forEach(mapping => {
        const mappingDiv = document.createElement('div');
        mappingDiv.className = 'list-item';
        mappingDiv.innerHTML = `
            <h4>Patient: ${mapping.patient_detail.full_name}</h4>
            <p><strong>Doctor:</strong> ${mapping.doctor_detail.full_name} (${mapping.doctor_detail.specialization})</p>
            <p><strong>Hospital:</strong> ${mapping.doctor_detail.hospital_name}</p>
            <p><strong>Assigned:</strong> ${new Date(mapping.assigned_at).toLocaleDateString()}</p>
            <div class="actions">
                <button onclick="deleteMapping(${mapping.id})" class="btn-danger">Remove Mapping</button>
            </div>
        `;
        container.appendChild(mappingDiv);
    });
}

function populateMappingSelects(patients, doctors) {
    const patientSelect = document.getElementById('mappingPatient');
    const doctorSelect = document.getElementById('mappingDoctor');

    patientSelect.innerHTML = '<option value="">Select Patient</option>';
    patients.forEach(patient => {
        patientSelect.innerHTML += `<option value="${patient.id}">${patient.full_name}</option>`;
    });

    doctorSelect.innerHTML = '<option value="">Select Doctor</option>';
    doctors.forEach(doctor => {
        doctorSelect.innerHTML += `<option value="${doctor.id}">${doctor.full_name} - ${doctor.specialization}</option>`;
    });
}

function showAddMappingForm() {
    document.getElementById('mappingForm').style.display = 'block';
}

function hideMappingForm() {
    document.getElementById('mappingForm').style.display = 'none';
    document.getElementById('addMappingForm').reset();
}

async function addMapping(event) {
    event.preventDefault();
    
    const mappingData = {
        patient: parseInt(document.getElementById('mappingPatient').value),
        doctor: parseInt(document.getElementById('mappingDoctor').value)
    };

    try {
        const response = await fetchWithAuth(`${API_BASE}/mappings/`, {
            method: 'POST',
            body: JSON.stringify(mappingData)
        });

        const data = await response.json();

        if (data.success) {
            showMessage('Mapping added successfully!', 'success');
            hideMappingForm();
            loadMappings();
        } else {
            showMessage(data.message || 'Failed to add mapping', 'error');
        }
    } catch (error) {
        showMessage('Error adding mapping', 'error');
    }
}

async function deleteMapping(id) {
    if (!confirm('Are you sure you want to remove this mapping?')) return;

    try {
        const response = await fetchWithAuth(`${API_BASE}/mappings/${id}/`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showMessage('Mapping removed successfully!', 'success');
            loadMappings();
        } else {
            showMessage('Failed to remove mapping', 'error');
        }
    } catch (error) {
        showMessage('Error removing mapping', 'error');
    }
}

// Search Functions
async function searchPatients() {
    const searchTerm = document.getElementById('patientSearch').value;
    try {
        const response = await fetchWithAuth(`${API_BASE}/patients/?search=${searchTerm}`);
        const data = await response.json();
        
        if (data.success) {
            displayPatients(data.results);
        }
    } catch (error) {
        showMessage('Error searching patients', 'error');
    }
}

async function searchDoctors() {
    const searchTerm = document.getElementById('doctorSearch').value;
    try {
        const response = await fetchWithAuth(`${API_BASE}/doctors/?search=${searchTerm}`);
        const data = await response.json();
        
        if (data.success) {
            displayDoctors(data.results);
        }
    } catch (error) {
        showMessage('Error searching doctors', 'error');
    }
}

// Utility Functions
async function fetchWithAuth(url, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    };

    const mergedOptions = { ...defaultOptions, ...options };
    
    let response = await fetch(url, mergedOptions);

    // Handle token refresh
    if (response.status === 401) {
        await refreshAccessToken();
        mergedOptions.headers['Authorization'] = `Bearer ${accessToken}`;
        response = await fetch(url, mergedOptions);
    }

    return response;
}

async function refreshAccessToken() {
    try {
        const response = await fetch(`${API_BASE}/auth/token/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken })
        });

        const data = await response.json();

        if (data.access) {
            accessToken = data.access;
            localStorage.setItem('accessToken', accessToken);
        } else {
            logout();
        }
    } catch (error) {
        logout();
    }
}

function showMessage(message, type = 'info') {
    const container = document.getElementById('messageContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    container.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Placeholder functions for edit functionality
function editPatient(id) {
    showMessage('Edit functionality not implemented yet', 'info');
}

function editDoctor(id) {
    showMessage('Edit functionality not implemented yet', 'info');
}
