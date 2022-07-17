import { createContext, useContext, useState } from "react"

export const BelvoContext = createContext();

export function BelvoProvider({children}){
  const [activeLink, setActivelink] = useState('');
  const [userInstitution, setUserInstitution] = useState('');

  function saveRegisteredLink(link){
    setActivelink(link)
  }

  function saveInstitution(institution){
    setUserInstitution(institution)
  }

  return (
    <BelvoContext.Provider value={{
      activeLink, 
      userInstitution,
      saveRegisteredLink,
      saveInstitution}}>

      {children}
      
    </BelvoContext.Provider>
  )
}

export const useBelvo = () => useContext(BelvoContext)
