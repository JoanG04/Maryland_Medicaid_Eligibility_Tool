// Define applicant data structure
let applicant = {
    income: 0,
    household_size: 0,
    immigration_status: {
        "green Card": null,
        "asylum": null,
        "refugee": null,
        "traffic victim": null,
        "undocumented": null,
        "visa": null,
        "work permit": null,
        "parole": null,
        "tps": null
    },
    age: 0,
    pregnant: null,
    chronic_condition: null
};

// Function to collect applicant information
function collect_applicant_info() {
    applicant.income = null;
    applicant.household_size = null;
    applicant.age = null;
    applicant.pregnant = null;
    applicant.chronic_condition = null;
    applicant.immigration_status[null] = null;
}

//income vs. household size check function
function income_household_size_check(applicant) {
    const incomeThresholds = {
        1: 20783,
        2: 28207,
        3: 35632,
        4: 43056,
        5: 50480,
        6: 57905,
        7: 65329,
        8: 72754
    };

    const threshold = incomeThresholds[applicant.household_size];
    return applicant.income <= threshold;
}

//check eligibility function
function check_eligibility(applicant) {
    if (applicant.pregnant) {
        return "Medicaid";
    }

    if (applicant.immigration_status['undocumented']) {
        return "Not Eligible";
    }

    if (income_household_size_check(applicant)) {
        if (applicant.immigration_status['green Card'] >= 5 ||
            applicant.immigration_status['asylum'] ||
            applicant.immigration_status['refugee'] ||
            applicant.immigration_status['traffic victim']) {
            return "Medicaid";
        } else {
            if (applicant.immigration_status['green Card'] < 5 ||
                applicant.immigration_status['visa'] ||
                applicant.immigration_status['work permit'] ||
                applicant.immigration_status['parole'] ||
                applicant.immigration_status['tps']){
                if(applicant.age <= 18){
                    return "Medicaid"
                } return "MarketPlace"
            }
        }
    } else {
        if (applicant.immigration_status['green Card'] >= 5 ||
            applicant.immigration_status['asylum'] ||
            applicant.immigration_status['refugee'] ||
            applicant.immigration_status['traffic victim']) {
            if (applicant.age <= 18) {
                return "MCHP";
            } else {
                if (applicant.chronic_condition && applicant.income <= 10000) {
                    return "EID";
                }
                return "MarketPlace";
            }
        } else {
            if (applicant.age <= 18) {
                return "MCHP";
            } else {
                return "MarketPlace";
            }
        }
    }
}

// Main program flow
collect_applicant_info();
let eligibilityResult = check_eligibility(applicant);
console.log("Eligibility result:", eligibilityResult);
