import { Fragment, useState } from 'react'
import {
  Dialog,
  DialogPanel,
  PopoverGroup,
} from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useContext } from 'react'
import { AppInfoContext } from '../AppInfoModel'
import { Button, Flex, Title,  } from '@tremor/react'
import { useNavigate } from 'react-router-dom'
export default function Header() {
  const info = useContext(AppInfoContext);
  const navigator = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  return (
    <header className="transparent">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <Flex onClick={()=>{navigator("/")}} className="flex lg:flex-1">
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt=""/>
        </Flex>
        <Flex className="flex lg:hidden">
          <Button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 "
            onClick={() => setMobileMenuOpen(true)}
          >
            <Title className="sr-only">Open main menu</Title>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </Button>
        </Flex>
        {info.isLoggedIn ?
         <PopoverGroup className="hidden lg:flex lg:gap-x-12">
         <Button onClick={()=> navigator("/history")}> History</Button>
        </PopoverGroup>:<></>}
        <Flex className="hidden lg:flex lg:flex-1 lg:justify-end">
        {
         !info.isLoggedIn ?  <a
                  href="/login"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7  "
                >
                  Log in
                </a> :  <a
                  href="/logout"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7  "
                >
                  Log out
                </a>}
        </Flex>
      </nav>
      <Dialog className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <Flex className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto">
          <Flex className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <Title className="sr-only">Your Company</Title>
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt=""
              />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 "
              onClick={() => setMobileMenuOpen(false)}
            >
              <Title className="sr-only">Close menu</Title>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </Flex>
          <Flex className="mt-6 flow-root">
            <Flex className="-my-6 divide-y divide-gray-500/10">
              <Flex className="space-y-2 py-6">
               
               {info.isLoggedIn ?   <Button onClick={()=> navigator("/history")}> History</Button> : <></>}
              </Flex>
              <Flex className="py-6">
               {!info.isLoggedIn ?  <a
                  href="/login"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7  "
                >
                  Log in
                </a> :  <a
                  href="/logout"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7  "
                >
                  Log out
                </a>}
              </Flex>
            </Flex>
          </Flex>
        </DialogPanel>
      </Dialog>
    </header>
  )
}
