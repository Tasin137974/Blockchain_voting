const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">BlockVote</h3>
            <p className="text-gray-400">Secure, Transparent, Immutable</p>
          </div>

          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <a href="#" className="hover:text-gray-300">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gray-300">
              Terms of Service
            </a>
            <a href="#" className="hover:text-gray-300">
              Contact
            </a>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} BlockVote. All rights reserved.</p>
          <p className="mt-1">Powered by Blockchain Technology</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
