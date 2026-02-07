// Mock data for User Management

// Generate mock users
const firstNames = [
  "Jane",
  "Cody",
  "Esther",
  "Cameron",
  "John",
  "Sarah",
  "Michael",
  "Emily",
  "David",
  "Jessica",
  "Robert",
  "Lisa",
  "William",
  "Karen",
  "James",
  "Nancy",
  "Daniel",
  "Betty",
  "Matthew",
  "Helen",
];

const lastNames = [
  "Cooper",
  "Fisher",
  "Howard",
  "Williamson",
  "Doe",
  "Johnson",
  "Smith",
  "Brown",
  "Davis",
  "Miller",
  "Wilson",
  "Moore",
  "Taylor",
  "Anderson",
  "Thomas",
  "Jackson",
  "White",
  "Harris",
  "Martin",
  "Thompson",
];

const roles = ["Admin", "Vendor", "Customer", "Auditor", "Manager"];
const domains = [
  "@tbm-bogat.com",
  "@example.com",
  "@gmail.com",
  "@email.com",
  "@company.com",
];

const avatarColors = [
  { bg: "#EEF2FF", text: "#4F46E5" }, // Indigo
  { bg: "#F3E8FF", text: "#9333EA" }, // Purple
  { bg: "#FEF2F2", text: "#DC2626" }, // Red
  { bg: "#D1FAE5", text: "#059669" }, // Green
  { bg: "#FEF3C7", text: "#D97706" }, // Amber
  { bg: "#F1F5F9", text: "#64748B" }, // Slate
];

// Generate 452 users
export const mockUsers = Array.from({ length: 452 }, (_, index) => {
  const firstName = firstNames[index % firstNames.length];
  const lastName = lastNames[Math.floor(index / firstNames.length) % lastNames.length];
  const fullName = `${firstName} ${lastName}`;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${domains[index % domains.length]}`;
  const role = roles[index % roles.length];
  const isActive = Math.random() > 0.2; // 80% active
  const colorScheme = avatarColors[index % avatarColors.length];

  return {
    id: `USR-${8821 + index}`,
    name: fullName,
    email,
    role,
    isActive,
    avatar: index < 20 ? `/avatars/user-${index + 1}.jpg` : null, // First 20 have images
    initials: `${firstName[0]}${lastName[0]}`,
    colorScheme,
    createdAt: new Date(2024, 0, 1 + index).toISOString(),
    lastLogin: isActive ? new Date(2024, 1, Math.floor(Math.random() * 28) + 1).toISOString() : null,
  };
});

// Role badge colors
export const roleBadgeColors = {
  Admin: { bg: "bg-[#EEF2FF]", text: "text-[#4F46E5]" },
  Vendor: { bg: "bg-[#D1FAE5]", text: "text-[#059669]" },
  Customer: { bg: "bg-[#F3E8FF]", text: "text-[#9333EA]" },
  Auditor: { bg: "bg-[#FEF3C7]", text: "text-[#D97706]" },
  Manager: { bg: "bg-[#DBEAFE]", text: "text-[#1E40AF]" },
};

// Mock API service
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const usersAPI = {
  // Get users with pagination, filtering, and search
  getUsers: async ({ page = 1, limit = 5, search = "", role = "all", status = "any" }) => {
    await delay(600);

    let filteredUsers = [...mockUsers];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.id.toLowerCase().includes(searchLower)
      );
    }

    // Apply role filter
    if (role !== "all") {
      filteredUsers = filteredUsers.filter((user) => user.role === role);
    }

    // Apply status filter
    if (status === "active") {
      filteredUsers = filteredUsers.filter((user) => user.isActive);
    } else if (status === "inactive") {
      filteredUsers = filteredUsers.filter((user) => !user.isActive);
    }

    // Calculate pagination
    const total = filteredUsers.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedUsers = filteredUsers.slice(start, end);

    return {
      users: paginatedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    };
  },

  // Get user by ID
  getUserById: async (id) => {
    await delay(400);
    return mockUsers.find((user) => user.id === id) || null;
  },

  // Toggle user status
  toggleUserStatus: async (id) => {
    await delay(500);
    const user = mockUsers.find((user) => user.id === id);
    if (user) {
      user.isActive = !user.isActive;
      return { success: true, user };
    }
    return { success: false };
  },

  // Update user role
  updateUserRole: async (id, newRole) => {
    await delay(500);
    const user = mockUsers.find((user) => user.id === id);
    if (user) {
      user.role = newRole;
      return { success: true, user };
    }
    return { success: false };
  },

  // Delete user
  deleteUser: async (id) => {
    await delay(500);
    const index = mockUsers.findIndex((user) => user.id === id);
    if (index !== -1) {
      mockUsers.splice(index, 1);
      return { success: true };
    }
    return { success: false };
  },

  // Export users (mock)
  exportUsers: async () => {
    await delay(1500);
    return {
      success: true,
      filename: `users-export-${new Date().toISOString().split("T")[0]}.csv`,
    };
  },
};
