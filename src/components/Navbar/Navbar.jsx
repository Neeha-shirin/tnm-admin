import { Navbar, Dropdown, TextInput, Avatar } from "flowbite-react";
import { HiMenu, HiX, HiSearch } from "react-icons/hi";
import { useState } from "react";
import logo from "../../assets/tnmlogo-SxopM0UJ.png";

export const UserNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Navbar
      fluid
      rounded
      className="bg-white dark:bg-gray-900 shadow-md px-4"
    >
      {/* Logo */}
      <Navbar.Brand href="/">
         <img
    src={logo}
    className="mr-3 h-6 lg:h-9"
    alt="Logo"
  />
        
        
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Admin Panel
        </span>
      </Navbar.Brand>

      {/* Search Bar */}
      <div className="hidden md:flex items-center flex-1 justify-center px-4">
        <TextInput
          icon={HiSearch}
          placeholder="Search..."
          className="w-full max-w-md"
        />
      </div>

      {/* Right Side: Dropdown + Mobile Toggle */}
      <div className="flex md:order-2 items-center gap-3">
        {/* Dropdown for Profile */}
        <Dropdown
          
          arrowIcon={false}
          inline
        >
          <Dropdown.Header>
            <span className="block text-sm">John Doe</span>
            <span className="block truncate text-sm font-medium">
              john@example.com
            </span>
          </Dropdown.Header>
          <Dropdown.Item>Dashboard</Dropdown.Item>
          <Dropdown.Item>Settings</Dropdown.Item>
          <Dropdown.Item>Earnings</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>Sign out</Dropdown.Item>
        </Dropdown>

        {/* Mobile toggle button */}
        <Navbar.Toggle
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-600 dark:text-gray-300"
        >
          {isOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
        </Navbar.Toggle>
      </div>

      {/* Menu Items */}
      <Navbar.Collapse className={`${isOpen ? "block" : "hidden"} md:block`}>
        
        
      </Navbar.Collapse>
    </Navbar>
  );
};
