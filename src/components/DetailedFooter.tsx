import Link from 'next/link';

export default function DetailedFooter() {
  const footerLinks = {
    "Explore Games": [
      "Preschool Math Games", "Grade K Math Games", "Grade 1 Math Games", "Grade 2 Math Games",
      "Grade 3 Math Games", "Grade 4 Math Games", "Grade 5 Math Games",
      "Preschool English Games", "Grade K English Games", "Grade 1 English Games",
      "Grade 2 English Games", "Grade 3 English Games", "Grade 4 English Games", "Grade 5 English Games"
    ],
    "Explore Worksheets": [
      "Preschool Math Worksheets", "Grade K Math Worksheets", "Grade 1 Math Worksheets", "Grade 2 Math Worksheets",
      "Grade 3 Math Worksheets", "Grade 4 Math Worksheets", "Grade 5 Math Worksheets",
      "Preschool English Worksheets", "Grade K English Worksheets", "Grade 1 English Worksheets",
      "Grade 2 English Worksheets", "Grade 3 English Worksheets", "Grade 4 English Worksheets", "Grade 5 English Worksheets"
    ],
    "Explore Lesson Plans": [
      "Grade K Math Lesson Plans", "Grade 1 Math Lesson Plans", "Grade 2 Math Lesson Plans",
      "Grade 3 Math Lesson Plans", "Grade 4 Math Lesson Plans", "Grade 5 Math Lesson Plans",
      "Grade K English Lesson Plans", "Grade 1 English Lesson Plans", "Grade 2 English Lesson Plans",
      "Grade 3 English Lesson Plans", "Grade 4 English Lesson Plans", "Grade 5 English Lesson Plans"
    ],
    "SplashLearn Content": [
      "For Parents", "For Classrooms", "For HomeSchoolers", "Blog", "About Us", "Careers", "Success Stories"
    ],
    "Help & Support": [
      "Parents", "Teachers", "Download SplashLearn", "Contact Us", "Gift SplashLearn"
    ]
  };

  return (
    <footer className="bg-[#0a0a4a] text-white pt-16 pb-8 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-bold mb-4 text-white">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-blue-200 hover:text-white transition-colors text-xs">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-blue-900 pt-8 flex flex-col md:flex-row justify-between items-end gap-4">
          <div className="space-y-4">
             <div className="flex gap-4 text-xs text-blue-300">
                <Link href="#" className="hover:text-white">Terms of use</Link>
                <span>|</span>
                <Link href="#" className="hover:text-white">Privacy Policy</Link>
                <span>|</span>
                <Link href="#" className="hover:text-white">Cookie Policy</Link>
             </div>
             <div className="text-xs text-blue-300">
              &copy; {new Date().getFullYear()} NadeeTeacher. All rights reserved. Trademarks of StudyPad, Inc.
             </div>
          </div>

          <div className="flex flex-col items-end gap-4">
             {/* Gift Subscription Button */}
             <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors">
                <span>Gift A Subscription</span>
             </button>
             
             {/* Seals */}
             <div className="flex gap-2">
                <div className="bg-yellow-400 text-blue-900 px-2 py-1 rounded text-xs font-bold">kidSAFE+ COPPA CERTIFIED</div>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
