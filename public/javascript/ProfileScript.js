function logout() {
    alert("Logging out...");
  }

  function uploadFile() {
    const fileInput = document.getElementById('fileUpload');
    if (fileInput.files.length > 0) {
      alert(`File "${fileInput.files[0].name}" uploaded successfully!`);
      fileInput.value = "";
    } else {
      alert("Please select a file to upload.");
    }
  }

const toggleBtn = document.getElementById('toggleBtn');
const sidebar = document.getElementById('sidebar');

toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
});