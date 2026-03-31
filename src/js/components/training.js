export const trainingCourses = [
  {
    id: 1,
    title: "IPv6 Fundamentals",
    level: "Beginner",
    header: "Core concepts of IPv6 networking",
    image: "/public/courses/core.webp",
    topics: [
      "Address Architecture",
      "ICMPv6 & NDP",
      "Configuration Basics"
    ],
    link: "#"
  },
  {
    id: 2,
    title: "Ipv6 Deployment",
    level: "Intermediate",
    header: "Deploy IPv6  in real networks",
    image: "/public/courses/deploy.webp",
    topics: [
      "Dual-Stack Deployment Strategies",
      "IPv4-to-IPv6 Transition Mechanisms",
      "Enterprise IPv6 Rollout"
    ],
    link: "#"
  },
  {
    id: 3,
    title: " IPv6 security",
    level: "Intermediate",
    header: "Secure modern IPv6 infrastructures",
    image: "/public/courses/secure.webp",
    topics: [
      "IPv6 Filtering & ACLs",
      "IPv6 Extension Header Security",
      "Threat Detection & Mitigation"
    ],
    link: "#"
  },
  {
    id: 4,
    title: "Advanced IPv6 Engineering",
    level: "Advanced",
    header: "Design large-scale IPv6 networks",
    image: "/public/courses/design.webp",
    topics: [
      "Advanced Routing (BGP / OSPFv3)",
      "IPv6 Service Provider Design",
      "Multicast IPv6 Networking"
    ],
    link: "#"
  }
];

export function renderTrainingCourses() {
  const coursesContainer = document.querySelector(".training-courses-grid");
  if (!coursesContainer) return;

  coursesContainer.innerHTML = trainingCourses.map(course => `
    <div class="training-course-card">
      <div class="course-image" style="background-image: url('${course.image}')">
        <span class="course-level">${course.title}</span>
      </div>
      <div class="course-content">
      <div class="course-header">
        <h3>${course.header}</h3>
        <p class="course-description">${course.level}</p>
        </div>
        <div class="course-topics">
          ${course.topics.map(topic => `
            <div class="topic-item">
              <span class="topic-checkbox"></span>
              <p>${topic}</p>
            </div>
          `).join('')}
        </div>
        <a href="${course.link}" class="learn-more-btn">Learn more</a>
      </div>
    </div>
  `).join('');
}

export function initTraining() {
  renderTrainingCourses();
}
