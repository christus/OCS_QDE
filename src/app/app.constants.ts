/****************************************
* This is an object, not an array
* (It was made as an object because
* in future value of status or ordering
* might change, so rather than updating
* indexes, it was made as an object) 
****************************************/
export const statuses = {
    "QDE Started": "1",
    "QDE Completed": "5",
    "KYC Document Uploaded": "10",
    "Terms and conditions accepted": "15",
    "Cheque Received": "16",
    "Cheque Bounced": "17",
    "Login Fee Paid": "20",
    "Eligibility Passed": "25",
    "Eligibility for review": "26",
    "Eligibility Accepted": "27",
    "Eligibility Rejected": "28",
    "Eligibility Review Accepted": "29",
    "Eligibility Failed": "30",
    "Eligibility Review Rejected": "31",
    "Mandatory Document Uploaded": "35",
    "DDE Submitted": "40"
}

export const multiSelectStatus = [
    { key: "QDE Started", value: "1" },
    { key: "QDE Completed", value: "5" },
    { key: "KYC Document Uploaded", value: "10" },
    { key: "Terms and conditions accepted", value: "15" },
    { key: "Cheque Received", value: "16" },
    { key: "Cheque Bounced", value: "17" },
    { key: "Login Fee Paid", value: "20" },
    { key: "Eligibility Passed", value: "25" },
    { key: "Eligibility for review", value: "26" },
    { key: "Eligibility Accepted", value: "27" },
    { key: "Eligibility Rejected", value: "28" },
    { key: "Eligibility Review Accepted", value: "29" },
    { key: "Eligibility Failed", value: "30" },
    { key: "Eligibility Review Rejected", value: "31" },
    { key: "Mandatory Document Uploaded", value: "35" },
    { key: "DDE Submitted", value: "40" }
];

export const screenPages = {
    "applicantDetails": "ApplicantDetails",
    "coApplicantDetails": "CoApplicantDetails",
    "loanDetails": "LoanDetails",
    "references": "References",
    "documentUploads": "DocumentUploads",
    "payments": "Payments"
}