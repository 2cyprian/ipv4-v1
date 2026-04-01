// Home page data and components
export const trainingData = {
  headline: "Public IPv6 Training",
  courses: [
    {
      icon: "/public/assets/icons/public.svg",
      title: "Public IPv6 Training",
      description: "Join us for a public scheduled IPv6 course.",
      details: "We regularly schedule public dates for our courses in public venues world-wide. Please see our current course schedule for advertised dates.",
      link: "Learn More...",
      href: "#"
    },
    {
      icon: "/public/assets/icons/site.svg",
      title: "On-Site IPv6 Training",
      description: "IPv6 training at your offices.",
      details: "Closed IPv6 training for your staff held at a location of your choosing. Our trainer comes to and the training can be tailored to your specific requirements.",
      link: "Learn More...",
      href: "#"
    },
    {
      icon: "/public/assets/icons/train.svg",
      title: "Modular IPv6 Training",
      description: "Build a tailored IPv6 course.",
      details: "With <span style=\"color:#5EBF40;\">IPv6 Tanzania</span>, get exactly the IPv6 training you need — choose from 100+ standard modules to build your own tailored course",
      link: "Learn More...",
      href: "#"
    },
    {
      icon: "/public/assets/icons/package.svg",
      title: "Training and Consultancy",
      description: "Training and consultancy packages.",
      details: "Opt for a mixture of on-site IPv6 training and IPv6 consultancy tailored to your needs. An efficient use of time and resources.",
      link: "Learn More...",
      href: "#"
    },
    {
      icon: "/public/assets/icons/map.svg",
      title: "Bespoke IPv6 Training",
      description: "IPv6 training developed for you.",
      details: "If our standard modules don't match your needs, we can customize or develop new ones. Bespoke modules can also be combined with our existing courses.",
      link: "Learn More...",
      href: "#"
    },
    {
      icon: "/public/assets/icons/remote.svg",
      title: "Remote IPv6 Training",
      description: "IPv6 training anywhere.",
      details: "For training in remote or multiple locations, we provide remote delivery combined with local or cloud-based labs.",
      link: "Learn More...",
      href: "#"
    }
  ]
};

// Render training courses section
export function renderCourses() {
  const coursesSection = document.querySelector('.courses-section');
  if (!coursesSection) return;

  const coursesHTML = trainingData.courses.map(course => `
    <div class="course-card">
      <span class="course-header">
        <img src="${course.icon}" alt="${course.title} icon" class="course-icon">
        <h3>${course.title}</h3>
      </span>
      <p class="course-desc">${course.description}</p>
      <p class="course-details">${course.details}</p>
      <a href="${course.href}" class="course-link">${course.link}</a>
    </div>
  `).join('');

  coursesSection.innerHTML = coursesHTML;
}



// Initialize home page components
export function initHome() {
  renderCourses();
}
