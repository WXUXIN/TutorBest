import React from 'react';
// import { Link } from 'react-router-dom';
import {useState} from 'react';
// import {useEffect} from 'react';
// import { Button } from "../../../dropdown-menu"
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuLabel,
//   DropdownMenuRadioGroup,
//   DropdownMenuRadioItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"



export default function Landing() {
    
  const [levelOfStudy, setLevelOfStudy] = useState('');
  const [subject, setSubject] = useState('');
  const [subjectOptions, setSubjectOptions] = useState([]);

  // For students to select their level of study
  const handleLevelOfStudyChange = (e) => {
    const selectedLevelOfStudy = e.target.value;
    setLevelOfStudy(selectedLevelOfStudy);

    // Update subject options based on the selected level of study
    if (selectedLevelOfStudy === 'Primary School') {
      setSubjectOptions([
        'English',
        'Mathematics',
        'Science',
        'Chinese', // e.g., Chinese, Malay, Tamil
        'Malay',
        'Tamil'
      ]);
    } else if (selectedLevelOfStudy === 'Secondary School') {
      setSubjectOptions([
        'English',
        'Mathematics',
        'Science',
        'Chinese', // e.g., Chinese, Malay, Tamil
        'Malay',
        'Tamil',
        'Additional Mathematics',
        'Principles of Accounts',
        'Combined Humanities',
        'Pure Sciences', // e.g., Physics, Chemistry, Biology
        'Humanities Elective Programme (HEP)',
        'Art',
        'Music',
        'Physical Education (PE)',
        'Health Education',
        'Design and Technology',
        'Food and Consumer Education',
        'Literature in English',
        'Geography',
        'History',
        'Social Studies',
        'Economics',
        'Business Studies',
        'Principles of Engineering',
        'Computer Science',
        'Media Studies',
        'Additional Science',
        'Biology',
        'Chemistry',
        'Physics'
      ]);
    } else if (selectedLevelOfStudy === 'Junior College') {
      setSubjectOptions([ 'General Paper',
      'Project Work',
      'Chinese', // e.g., H1 Chinese Language and Literature
      'Malay',
      'Tamil',
      'Mathematics',
      'Further Mathematics',
      'Chemistry',
      'Physics',
      'Biology',
      'Computing',
      'Economics',
      'History',
      'Geography',
      'Literature in English',
      'Art',
      'Music']);
    } else {
      setSubjectOptions([]);
    }

    // Reset the selected subject
    setSubject('');
  };

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };


    return (
    <section className="landing">
        <div className="dark-overlay">
          <div className="landing-inner">
          <h1 className="x-large-landing">
            I am in
            <select value={levelOfStudy} onChange={handleLevelOfStudyChange} className = "dropdown"
            style={{ fontSize: 'inherit' }}>
              <option value="">Level of Study</option>
              <option value="Primary School">Primary School</option>
              <option value="Secondary School">Secondary School</option>
              <option value="Junior College">Junior College</option>
            </select>
          
          </h1>

          <h1 className="x-large-landing">
                I am looking for a 
                <select value={subject} onChange={handleSubjectChange} className="dropdown">
                  {subjectOptions.length === 0 ? (
                    <option value="">Select level of study</option>
                  ) : (
                    <>
                      <option value="">Select subject</option>
                      {subjectOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </>
                  )}
                </select>
                tutor.
              </h1>
          </div>
        </div>
      </section>
    )
}
