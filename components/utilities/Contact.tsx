import React from "react";
import {
  FaFacebook,
  FaWhatsapp,
  FaPhone,
  FaTiktok,
  FaLinkedin,
  FaTelegramPlane,
  FaInstagram,
} from "react-icons/fa";
import { MailIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Contact = () => {
  const socialMediaIcons = [
    {
      id: 1,
      link: "https://web.facebook.com/christina.emegwa1",
      icon: <FaFacebook size={20} />,
      name: "Facebook",
    },
    {
      id: 2,
      link: "https://web.facebook.com/christina.emegwa1",
      icon: <FaTiktok size={20} />,
      name: "Tiktok",
    },
    {
      id: 3,
      link: "https://web.facebook.com/christina.emegwa1",
      icon: <FaLinkedin size={20} />,
      name: "Facebook",
    },
    {
      id: 4,
      link: "https://web.facebook.com/christina.emegwa1",
      icon: <FaTelegramPlane size={20} />,
      name: "Facebook",
    },
    {
      id: 5,
      link: "https://web.facebook.com/christina.emegwa1",
      icon: <FaInstagram size={20} />,
      name: "Facebook",
    },

    {
      id: 6,
      link: "tel:+2348038858159",
      icon: <FaPhone className="rotate-90" size={20} />,
      name: "Phone",
    },
    {
      id: 7,
      link: "mailto:tinahez3@gmail.com",
      icon: <MailIcon size={20} />,
      name: "Gmail",
    },
  ];

  return (
    <div className="relative flex flex-col items-center w-full bg-gray-900 text-white rounded-t-[25px] py-10 px-6 lg:px-16 mb-19">
      {/* Header */}
      <h2 className="text-3xl md:text-4xl font-semibold text-center mb-4">
        Contact Us
      </h2>
      <p className="text-gray-400 text-center max-w-2xl mb-8">
        Reach out to us through any of our platforms. Whether you have
        questions, feedback, or need assistance, we’re here to help you.
      </p>

      {/* Social Media Icons */}
      <div className="flex justify-center gap-6 mb-6">
        {socialMediaIcons.map((media) => (
          <Link href={media.link} key={media.id} title={media.name}>
            <div className="bg-gray-700 hover:bg-gray-600 p-3 rounded-full transition-transform duration-300 hover:scale-110">
              {media.icon}
            </div>
          </Link>
        ))}
      </div>

      {/* Logo or Particles */}
      <div className="w-[200px] h-[100px] relative mb-4">
        <Image
          src="/icons/particles.png"
          alt="Background particles"
          layout="responsive"
          width={200}
          height={100}
          className="invert opacity-70"
          priority
        />
      </div>

      {/* Footer Text */}
      <div className="text-center text-gray-500 text-sm">
        <p>
          &copy; {new Date().getFullYear()} Particles Marketplace. All rights
          reserved.
        </p>
        <p>
          Built with passion to connect buyers and sellers seamlessly across the
          globe.
        </p>
      </div>
      <svg
        className="absolute bottom-0 left-0 right-0 h-48 text-gray-700 opacity-40"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
      >
        <path fill="currentColor" d="M0,288L1440,160L1440,320L0,320Z"></path>
      </svg>
    </div>
  );
};

export default Contact;
