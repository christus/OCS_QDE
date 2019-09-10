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

export const screenPages = {
    "applicantDetails": "ApplicantDetails",
    "coApplicantDetails": "CoApplicantDetails",
    "loanDetails": "LoanDetails",
    "references": "References",
    "documentUploads": "DocumentUploads",
    "payments": "Payments"
}