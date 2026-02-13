// lib/api/designs.js

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mockDesigns = [
  {
    id: "design-001",
    title: "Nordic Living Area",
    room: "Living Room Reno",
    roomType: "living-room",
    image: "/designs/nordic-living.png",
    thumbnail: "/designs/nordic-living-thumb.jpg",
    createdAt: "2 hours ago",
    date: "2024-02-12T10:30:00Z",
    isFavorite: false,
    isHighRes: true,
    tags: ["modern", "scandinavian", "bright"],
  },
  {
    id: "design-002",
    title: "Geometric Wall Concept",
    room: "Dream Bath",
    roomType: "bathroom",
    image: "/designs/geometric-wall.png",
    thumbnail: "/designs/geometric-wall-thumb.jpg",
    createdAt: "Yesterday",
    date: "2024-02-11T14:20:00Z",
    isFavorite: false,
    isHighRes: false,
    tags: ["contemporary", "bold", "pattern"],
  },
  {
    id: "design-003",
    title: "Oak Floor Options",
    room: "Living Room Reno",
    roomType: "living-room",
    image: "/designs/oak-floor.png",
    thumbnail: "/designs/oak-floor-thumb.jpg",
    createdAt: "Oct 12, 2023",
    date: "2023-10-12T09:15:00Z",
    isFavorite: false,
    isHighRes: false,
    tags: ["natural", "warm", "wood"],
  },
  {
    id: "design-004",
    title: "Brass Fixture Detail",
    room: "Kitchen Reno",
    roomType: "kitchen",
    image: "/designs/brass-fixture.png",
    thumbnail: "/designs/brass-fixture-thumb.jpg",
    createdAt: "Oct 10, 2023",
    date: "2023-10-10T16:45:00Z",
    isFavorite: false,
    isHighRes: false,
    tags: ["elegant", "metallic", "luxury"],
  },
  {
    id: "design-005",
    title: "Matte Tile Texture",
    room: "Dream Bath",
    roomType: "bathroom",
    image: "/designs/matte-tile.png",
    thumbnail: "/designs/matte-tile-thumb.jpg",
    createdAt: "Oct 05, 2023",
    date: "2023-10-05T11:30:00Z",
    isFavorite: false,
    isHighRes: false,
    tags: ["minimalist", "subtle", "neutral"],
  },
  {
    id: "design-006",
    title: "Dining Chair Model",
    room: "Kitchen Reno",
    roomType: "kitchen",
    image: "/designs/dining-chair.png",
    thumbnail: "/designs/dining-chair-thumb.jpg",
    createdAt: "Sep 28, 2023",
    date: "2023-09-28T13:20:00Z",
    isFavorite: false,
    isHighRes: false,
    tags: ["furniture", "wood", "modern"],
  },
];

export const designsApi = {
  // Get all designs with filters
  getDesigns: async (filters) => {
    await delay(1000);

    let filteredDesigns = [...mockDesigns];

    // Apply room type filter
    if (filters.roomType && filters.roomType !== "all") {
      filteredDesigns = filteredDesigns.filter(
        (design) => design.roomType === filters.roomType,
      );
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredDesigns = filteredDesigns.filter(
        (design) =>
          design.title.toLowerCase().includes(searchLower) ||
          design.room.toLowerCase().includes(searchLower) ||
          design.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
      );
    }

    // Apply sorting
    switch (filters.sortBy) {
      case "newest":
        filteredDesigns.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "oldest":
        filteredDesigns.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "alphabetical":
        filteredDesigns.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "favorites":
        filteredDesigns.sort(
          (a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0),
        );
        break;
    }

    return filteredDesigns;
  },

  // Get single design details
  getDesignDetails: async (designId) => {
    await delay(800);
    const design = mockDesigns.find((d) => d.id === designId);
    if (!design) throw new Error("Design not found");
    return design;
  },

  // Toggle favorite
  toggleFavorite: async (designId) => {
    await delay(500);
    const design = mockDesigns.find((d) => d.id === designId);
    if (design) {
      design.isFavorite = !design.isFavorite;
    }
    return { success: true, isFavorite: design.isFavorite };
  },

  // Delete design
  deleteDesign: async (designId) => {
    await delay(600);
    const index = mockDesigns.findIndex((d) => d.id === designId);
    if (index > -1) {
      mockDesigns.splice(index, 1);
    }
    return { success: true };
  },

  // Download design
  downloadDesign: async (designId, quality = "standard") => {
    await delay(800);
    return {
      success: true,
      downloadUrl: `/downloads/design-${designId}-${quality}.jpg`,
    };
  },

  // Share design
  shareDesign: async (designId) => {
    await delay(500);
    return {
      success: true,
      shareUrl: `https://tbm.com/designs/${designId}`,
    };
  },
};
