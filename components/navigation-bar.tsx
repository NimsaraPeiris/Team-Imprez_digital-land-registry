export default function NavigationBar() {
  const navItems = ["Home", "Services", "About us", "Contact Us", "News & Events", "FAQ"]

  return (
    <nav className="w-full bg-[#4490CC] py-3">
      <div className="flex items-center gap-11 pl-[85px]">
        {navItems.map((item, index) => (
          <button
            key={index}
            className="text-white text-xl font-medium leading-6 hover:text-blue-100 transition-colors duration-200"
          >
            {item}
          </button>
        ))}
      </div>
    </nav>
  )
}
