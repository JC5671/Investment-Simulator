import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="flex justify-center">
      <div
        className="
		flex text-white mb-5"
      >
        {/* LinkedIn Link */}
        <a
          href="https://www.linkedin.com/in/jasonhenry5671"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 px-3 py-2 hover:text-[rgb(100,180,255)] transition p-3"
        >
          <FaLinkedin size={24} />
          <span className="text-sm font-medium">jasonhenry5671</span>
        </a>

        {/* Github Link */}
        <a
          href="https://github.com/JC5671"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 px-3 py-2 hover:text-[rgb(100,180,255)] transition p-3"
        >
          <FaGithub size={24} />
          <span className="text-sm font-medium">JC5671</span>
        </a>
      </div>
    </footer>
  );
}
