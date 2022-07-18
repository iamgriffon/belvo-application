export function deleteArrayItem(array, itemID){
  const deletedItem = array.find(item => item.id = itemID);
  const newArray = [...array].filter(item => item !== deletedItem);
  return newArray;
}
