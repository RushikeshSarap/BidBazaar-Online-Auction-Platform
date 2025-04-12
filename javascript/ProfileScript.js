function logout() {
    alert("Logging out...");
    // redirect or handle logout here
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