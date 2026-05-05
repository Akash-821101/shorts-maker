export interface VisualStyle {
  id: string;
  title: string;
  description: string;
  imagePath: string;
}

export const VISUAL_STYLES: VisualStyle[] = [
  {
    id: "style_cinematic",
    title: "Cinematic Realism",
    description: "Moody, highly detailed, realistic lighting with depth of field.",
    imagePath: "/styles/cinematic.png"
  },
  {
    id: "style_anime",
    title: "Anime / Manga",
    description: "Vibrant Studio Ghibli style 2D illustrations with rich backgrounds.",
    imagePath: "/styles/anime.png"
  },
  {
    id: "style_3d_cartoon",
    title: "3D Cartoon",
    description: "Cute, expressive Pixar-style 3D renders with soft lighting.",
    imagePath: "/styles/3d_cartoon.png"
  },
  {
    id: "style_comic",
    title: "Vintage Comic",
    description: "Pop art, halftone dots, bold outlines, and vibrant flat colors.",
    imagePath: "/styles/comic.png"
  },
  {
    id: "style_cyberpunk",
    title: "Cyberpunk Neon",
    description: "Futuristic dark alleys, glowing lights, and neon accents.",
    imagePath: "/styles/cyberpunk.png"
  }
];
