import { ApiResponse } from '../types/artwork';



export async function fetchArtworks(page: number) {
  const response = await fetch(
    `https://api.artic.edu/api/v1/artworks?page=${page}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch artworks');
  }

  const data: ApiResponse = await response.json();
  return data;
}
