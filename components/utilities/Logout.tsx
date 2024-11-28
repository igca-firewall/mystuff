import { useSignOutAccount } from '@/lib/react-query/queriesAndMutation';
import { LocalStorageManager } from '@/lib/utils';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react'

const Logout = () => {
     const {
        mutateAsync : loggedOut

       } = useSignOutAccount()
     
    const router = useRouter();

    const handleLogOut = async () => {
       LocalStorageManager();
     
    loggedOut()
       router.push("/sign-in");
    };
  
  return (
    <div><Image onClick={handleLogOut}
    src="icons/logout.svg" height={20} width={20} alt="Logout"
    /></div>
  )
}

export default Logout