<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My CV - [Your Name]</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<style>
    .cv-section {
  margin-bottom: 2rem;
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1rem 1.5rem;
  transition: all 0.4s ease-in-out;
}

.cv-section h2 {
  cursor: pointer;
  color: #0056b3;
}

.cv-content {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: all 0.6s ease;
}

.cv-section:hover .cv-content {
  max-height: 400px;
  opacity: 1;
}

</style>

<body>
  <header id="header"></header>

  <main class="container my-5">
    <h1 class="text-center mb-4">My CV</h1>

    <div class="cv-section" id="personal-info">
      <h2>Personal Information</h2>
      <div class="cv-content">
        <p><strong>Name:</strong> Arooj Fatima</p>
        <p><strong>Email:</strong> arooj@example.com</p>
        <p><strong>Location:</strong> Lahore, Pakistan</p>
      </div>
    </div>

    <div class="cv-section" id="education">
      <h2>Education</h2>
      <div class="cv-content">
        <p><strong>BS Computer Science</strong> — COMSATS University (2023–2027)</p>
        <p>Relevant Courses: Web Technologies, OOP, Database Systems</p>
      </div>
    </div>

    <div class="cv-section" id="skills">
      <h2>Skills</h2>
      <div class="cv-content">
        <ul>
          <li>HTML, CSS, JavaScript</li>
          <li>React Native, Bootstrap</li>
          <li>SQL Server, JavaFX</li>
        </ul>
      </div>
    </div>

    <div class="cv-section" id="projects">
      <h2>Projects</h2>
      <div class="cv-content">
        <p><strong>Flour Management System</strong> — Java + SQL Server</p>
        <p><strong>Medicine Finder App</strong> — React Native + Strapi</p>
        <p><strong>Smart City Dashboard</strong> — Webathon Project</p>
      </div>
    </div>

    <div class="cv-section" id="contact">
      <h2>Contact Information</h2>
      <div class="cv-content">
        <p>Email: arooj@example.com</p>
        <p>Phone: +92 300 1234567</p>
        <p>LinkedIn: linkedin.com/in/aroojfatima</p>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer id="footer"></footer>
  <script src="script.js"></script>
  <script>
    // script.js
$(document).ready(function () {
  $(".cv-section h2").click(function () {
    $(this).next(".cv-content").slideToggle(500);
  });
});

  </script>
</body>

</html>
