// ============================================================
// To Do List - Starter
// Baca README.md untuk daftar lengkap fitur yang harus dibuat
// dan hint pengerjaannya sebelum mulai coding.
// ============================================================
const listHariIni = document.getElementById('list-hari-ini');
const listBesok = document.getElementById('list-besok');
const listKapan = document.getElementById('list-kapan');
const listKelar = document.getElementById('list-kelar');
const modal = document.getElementById('modal-overlay');
const inputModal = document.getElementById('modal-input');
const inputQuick = document.getElementById('quick-input');
const taskCounter = document.getElementById("task-counter");
const clearCompletedBtn = document.getElementById("clear-completed");
const themeToggleBtn = document.getElementById("theme-toggle");

// Struktur satu task: { id, text, completed }
// NOTE: "completed" sudah disiapkan di data model, tapi belum
// dipakai di mana pun. Itu tugas kamu di Fitur #1.
let tasks = [];
let nextId = 1;
let currentFilter = "all";
let selectedPanik = 'PENTING';
let selectedKapan = 'Hari Ini';

const savedTasks = localStorage.getItem("tasks");
if (savedTasks !== null) {
  tasks = JSON.parse(savedTasks);
  if (tasks.length > 0) {
    nextId = Math.max(...tasks.map((task) => task.id)) + 1;
    tasks.forEach(t => {
        if (!t.time) t.time = 'Hari Ini';
        if (!t.panicLevel) t.panicLevel = 'PENTING';
    });
  }
}

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeToggleBtn.textContent = "Light Mode";
}

themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        themeToggleBtn.textContent = "Light Mode";
    } else {
        localStorage.setItem("theme", "light");
        themeToggleBtn.textContent = "Dark Mode";
    }
});

// TODO (Fitur #4 - Simpan ke localStorage):
// Saat aplikasi pertama kali dibuka, load "tasks" dari localStorage
// (kalau ada) sebelum renderTasks() dipanggil pertama kali di bawah.
// Hint: gunakan JSON.parse(localStorage.getItem("tasks")) dan cek
// null-nya sebelum dipakai.

function renderTasks() {
  listHariIni.innerHTML = "";
  listBesok.innerHTML = "";
  listKelar.innerHTML = "";
  if (listKapan) listKapan.innerHTML = "";

    // TODO (Fitur #3 - Filter Task):
    // Sebelum di-loop, filter dulu "tasks" sesuai filter aktif
    // (semua / aktif / selesai). Sekarang semua task selalu ditampilkan.
    let filteredTasks = tasks;
    if (currentFilter === "active") {
      filteredTasks = tasks.filter(task => task.completed === false);
    } else if (currentFilter === "completed") {
      filteredTasks = tasks.filter(task => task.completed === true);
    }

      if (filteredTasks.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";
    emptyState.textContent = "Belum ada task. Tambahkan satu di atas!";
    listHariIni.appendChild(emptyState);
  } else {
    filteredTasks.forEach((task) => {
      const div = document.createElement("div");
      div.className = "task-item";
      if (task.completed) div.classList.add("completed");
      div.dataset.id = task.id;

      // TODO (Fitur #1 - Tandai Selesai):
      // Tambahkan <input type="checkbox"> di sini yang mencerminkan
      // task.completed, dan tambahkan class "completed" pada `li`
      // kalau task.completed === true.

      const checkbox = document.createElement("div");
      checkbox.className = "circle-checkbox";
      if (task.completed) {
          checkbox.innerHTML = `<svg width="14" height="14" fill="#fff" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>`;
      }
      checkbox.addEventListener("click", () => toggleComplete(task.id));

      const taskContent = document.createElement("div");
      taskContent.className = "task-content";

      const span = document.createElement("div");
      span.className = "task-text";
      span.textContent = task.text;

      let badgeHtml = '';
      if (!task.completed && task.panicLevel) {
          badgeHtml = `<span class="badge">${task.panicLevel}</span>`;
      }
      taskContent.innerHTML = badgeHtml;
      taskContent.prepend(span);

      const actionDiv = document.createElement("div");
      actionDiv.className = "task-actions";

      // TODO (Fitur #2 - Edit Task):
      // Tambahkan tombol "Edit" di sini. Saat diklik, ganti `span`
      // menjadi <input> berisi teks task supaya bisa diubah,
      // lalu simpan perubahannya saat user menekan Enter / klik Save.
      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "icon-btn edit-btn";
      editBtn.setAttribute("aria-label", "Edit task");
      editBtn.innerHTML = `<svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg>`;
      
      editBtn.addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "text";
        input.className = "task-edit-input";
        input.value = task.text;
        
        let isSaved = false;
        const saveEdit = () => {
          if (isSaved) return;
          isSaved = true;
          editTask(task.id, input.value);
        };
        input.addEventListener("keydown", (event) => {
          if (event.key === "Enter") saveEdit();
        });
        input.addEventListener("blur", saveEdit);
        
        taskContent.replaceChild(input, span);
        input.focus();
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "icon-btn delete-btn";
      deleteBtn.innerHTML = `<svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>`;
      deleteBtn.addEventListener("click", () => deleteTask(task.id));

      div.appendChild(checkbox);
      div.appendChild(taskContent);
      if (!task.completed) actionDiv.appendChild(editBtn); 
      actionDiv.appendChild(deleteBtn);
      div.appendChild(actionDiv);

      if (task.completed) {
        listKelar.appendChild(div);
      } else if (task.time === 'Besok') {
        listBesok.appendChild(div);
      } else if (task.time === 'Pilih Tanggal') {
        if (listKapan) listKapan.appendChild(div);
      } else {
        listHariIni.appendChild(div);
      }
    });
  }

    // TODO (Fitur #5 - Counter):
    // Update elemen #task-counter di sini setiap kali renderTasks() dipanggil,
    // isinya jumlah task yang belum selesai. Contoh: "3 task tersisa".
    if (taskCounter) {
      const activeCount = tasks.filter(t => !t.completed).length;
      taskCounter.textContent = `${activeCount} task tersisa`;
  }

  // TODO (Fitur #4 - Simpan ke localStorage):
  // Setiap kali renderTasks() dipanggil, data "tasks" sudah berubah,
  // jadi ini tempat yang pas untuk menyimpan ulang ke localStorage.
  // Hint: localStorage.setItem("tasks", JSON.stringify(tasks));

  // Simpan data tasks ke localStorage setiap kali renderTasks() dipanggil.
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask(text, panicLevel, time) {
  const trimmed = text.trim();
  if (trimmed === "") return;
  tasks.push({
    id: nextId++,
    text: trimmed,
    panicLevel: panicLevel || 'PENTING',
    time: time || 'Hari Ini',
    completed: false
  });
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  renderTasks();
}
// TODO (Fitur #1 - Tandai Selesai):
// Buat function toggleComplete(id) yang membalik nilai task.completed
// untuk task dengan id yang cocok, lalu panggil renderTasks().

function toggleComplete(id) {
  const task = tasks.find((item) => item.id === id);
  if (!task) return;
  task.completed = !task.completed;
  renderTasks();
}

// TODO (Fitur #2 - Edit Task):
// Buat function editTask(id, newText) yang mengubah task.text
// untuk task dengan id yang cocok, lalu panggil renderTasks().
function editTask(id, newText) {
  const trimmedText = newText.trim();
  if (trimmedText === "") return;
  const task = tasks.find((item) => item.id === id);
  if (!task) return;
  task.text = trimmedText;
  renderTasks();
}

// TODO (Fitur #6 - Clear Completed):
// Buat function clearCompleted() yang menghapus semua task dengan
// completed === true dari array "tasks", lalu panggil renderTasks().
// Jangan lupa tambahkan event listener untuk tombol #clear-completed.
function clearCompleted() {
    tasks = tasks.filter(t => !t.completed);
    renderTasks();
}

if (clearCompletedBtn) {
    clearCompletedBtn.addEventListener('click', () => {
        clearCompleted();
    });
}

// TODO (Fitur #3 - Filter Task):
// Simpan filter yang sedang aktif di sebuah variabel, misalnya
// `let currentFilter = "all";`, lalu tambahkan event listener untuk
// setiap .filter-btn yang mengubah currentFilter dan memanggil
// renderTasks() ulang.
const filterBtns = document.querySelectorAll(".filter-btn");
filterBtns.forEach(btn => {
  btn.addEventListener("click", (e) => {
    filterBtns.forEach(b => b.classList.remove("active"));
    e.target.classList.add("active");
    currentFilter = e.target.dataset.filter;
    renderTasks();
  });
});

const panikBtns = document.querySelectorAll('#group-panik .btn-pill');
  const kapanBtns = document.querySelectorAll('#group-kapan .btn-pill');

document.getElementById('btn-tambah').addEventListener('click', () => {
    modal.classList.remove('hidden');
    inputModal.value = inputQuick.value; 
    inputModal.focus();
});

document.getElementById('btn-batal').addEventListener('click', () => {
    modal.classList.add('hidden');
});

panikBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        panikBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        selectedPanik = e.target.getAttribute('data-value');
    });
});

kapanBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        kapanBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        selectedKapan = e.target.getAttribute('data-value');
    });
});

document.getElementById('btn-submit').addEventListener('click', (e) => {
    e.preventDefault();
    const teksTugas = inputModal.value;
    if (teksTugas.trim() === '') {
        return; 
    }
    addTask(teksTugas, selectedPanik, selectedKapan);
    inputModal.value = '';
    document.getElementById('quick-input').value = '';
    modal.classList.add('hidden');
});

inputQuick.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        document.getElementById('btn-tambah').click();
    }
});

renderTasks();