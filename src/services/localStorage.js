export const saveResources = (resources) => {
  localStorage.setItem('aidnet-resources', JSON.stringify(resources));
};

export const loadResources = () => {
  const saved = localStorage.getItem('aidnet-resources');
  return saved ? JSON.parse(saved) : null;
};

export const clearResources = () => {
  localStorage.removeItem('aidnet-resources');
};