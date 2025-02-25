import React from "react";
import policyData from "@/app/components/auth/Policy.json";

const TermsOfService = () => {
  const { termsOfService } = policyData;

  return (
    <div>   
      {termsOfService.sections.map((section, index) => (
        <div key={index} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{section.heading}</h2>
          <p className="text-sm">{section.content}</p>

          {section.list && (
            <ul className="mt-2 list-disc pl-5">
              {section.list.map((item, idx) => (
                <li key={idx} className="text-sm">{item}</li>
              ))}
            </ul>
          )}
{/* 
          {section.footer && <p className="mt-2 text-sm font-semibold">{section.footer}</p>} */}
        </div>
      ))}
    </div>
  );
};

export default TermsOfService;
