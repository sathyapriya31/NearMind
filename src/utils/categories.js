/**
 * CATEGORIES
 * Each entry maps a user-friendly label to a Google Places type string.
 */
export const CATEGORIES = [
  {
    id: 'hotel',
    label: 'Hotel',
    pluralLabel: 'Hotels',
    placesType: 'lodging',   // Google Places API type
    emoji: '🏨',
    color: '#f7a26c',
    bgColor: 'rgba(247,162,108,0.12)',
  },
  {
    id: 'hospital',
    label: 'Hospital',
    pluralLabel: 'Hospitals',
    placesType: 'hospital',
    emoji: '🏥',
    color: '#6cf7a8',
    bgColor: 'rgba(108,247,168,0.12)',
  },
  {
    id: 'park',
    label: 'Park',
    pluralLabel: 'Parks',
    placesType: 'park',
    emoji: '🌳',
    color: '#a2f76c',
    bgColor: 'rgba(162,247,108,0.12)',
  },
  {
    id: 'school',
    label: 'School',
    pluralLabel: 'Schools',
    placesType: 'school',
    emoji: '🎓',
    color: '#f76ca2',
    bgColor: 'rgba(247,108,162,0.12)',
  },
];

export function getCategoryById(id) {
  return CATEGORIES.find(c => c.id === id);
}
