// script.js
(() => {
  const form = document.getElementById("studentForm");
  const submitBtn = document.getElementById("submitBtn");
  const cancelEditBtn = document.getElementById("cancelEditBtn");
  const tbody = document.querySelector("#studentsTable tbody");

  let students = [];
  let editIndex = null;

  // Save students array to localStorage
  function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
  }

  // Load students array from localStorage
  function loadStudents() {
    const data = localStorage.getItem("students");
    students = data ? JSON.parse(data) : [];
  }

  // Validate input fields with custom checks
  function validateInputs(name, id, email, contact) {
    const nameRegex = /^[A-Za-z\s]+$/;
    const idRegex = /^\d+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const contactRegex = /^\d{10,}$/;

    if (!name || !id || !email || !contact) {
      alert("All fields are required.");
      return false;
    }
    if (!nameRegex.test(name)) {
      alert("Student name must contain only letters and spaces.");
      return false;
    }
    if (!idRegex.test(id)) {
      alert("Student ID must contain only numbers.");
      return false;
    }
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return false;
    }
    if (!contactRegex.test(contact)) {
      alert("Contact number must be at least 10 digits.");
      return false;
    }
    return true;
  }

  // Clear form inputs and reset buttons
  function clearForm() {
    form.reset();
    editIndex = null;
    submitBtn.textContent = "Add Student";
    cancelEditBtn.classList.add("hidden");
  }

  // Render the students table body
  function renderTable() {
    tbody.innerHTML = "";
    if (students.length === 0) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 5;
      td.textContent = "No student records found.";
      td.style.textAlign = "center";
      tr.appendChild(td);
      tbody.appendChild(tr);
      return;
    }

    students.forEach((student, index) => {
      const tr = document.createElement("tr");

      const tdName = document.createElement("td");
      tdName.textContent = student.name;
      tr.appendChild(tdName);

      const tdID = document.createElement("td");
      tdID.textContent = student.id;
      tr.appendChild(tdID);

      const tdEmail = document.createElement("td");
      tdEmail.textContent = student.email;
      tr.appendChild(tdEmail);

      const tdContact = document.createElement("td");
      tdContact.textContent = student.contact;
      tr.appendChild(tdContact);

      const tdActions = document.createElement("td");

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.classList.add("action-btn");
      editBtn.addEventListener("click", () => startEdit(index));
      tdActions.appendChild(editBtn);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.classList.add("action-btn", "delete");
      deleteBtn.addEventListener("click", () => deleteStudent(index));
      tdActions.appendChild(deleteBtn);

      tr.appendChild(tdActions);

      tbody.appendChild(tr);
    });
  }

  // Add a new student
  function addStudent(student) {
    students.push(student);
    saveStudents();
    renderTable();
  }

  // Update an existing student
  function updateStudent(index, student) {
    students[index] = student;
    saveStudents();
    renderTable();
  }

  // Delete a student record
  function deleteStudent(index) {
    if (confirm("Are you sure you want to delete this record?")) {
      students.splice(index, 1);
      saveStudents();
      renderTable();
      if (editIndex === index) clearForm();
    }
  }

  // Start editing a student record
  function startEdit(index) {
    const student = students[index];
    form.studentName.value = student.name;
    form.studentID.value = student.id;
    form.emailID.value = student.email;
    form.contactNumber.value = student.contact;
    submitBtn.textContent = "Update Student";
    cancelEditBtn.classList.remove("hidden");
    editIndex = index;
  }

  // Cancel editing handler
  cancelEditBtn.addEventListener("click", () => {
    clearForm();
  });

  // Form submit handler
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.studentName.value.trim();
    const id = form.studentID.value.trim();
    const email = form.emailID.value.trim();
    const contact = form.contactNumber.value.trim();

    if (!validateInputs(name, id, email, contact)) return;

    const student = { name, id, email, contact };

    if (editIndex !== null) {
      // For update, allow same ID if it's the one being edited, otherwise check for duplicates
      const duplicate = students.some((s, i) => s.id === id && i !== editIndex);
      if (duplicate) {
        alert("Student ID already exists. Please use a unique Student ID.");
        return;
      }
      updateStudent(editIndex, student);
    } else {
      // Adding new student: check duplicate ID
      if (students.some((s) => s.id === id)) {
        alert("Student ID already exists. Please use a unique Student ID.");
        return;
      }
      addStudent(student);
    }

    clearForm();
  });

  // Initialization
  loadStudents();
  renderTable();
})();