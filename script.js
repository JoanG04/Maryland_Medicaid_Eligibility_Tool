let applicant = {
    income: 0,
    household_size: 0,
    immigration_status: {
        "citizen": null,
        "green card": null,
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

function collect_applicant_info(form_data) {
    applicant.income = form_data.income;
    applicant.household_size = form_data.household_size;
    applicant.age = form_data.age;
    applicant.pregnant = form_data.pregnant;
    applicant.chronic_condition = form_data.chronic_condition;

    if (typeof form_data.immigration_status === 'string') {
        applicant.immigration_status[form_data.immigration_status] = true;
    } else {
        if (form_data.immigration_status['green card'] !== undefined) {
            applicant.immigration_status['green card'] = form_data.immigration_status['green card'];
        } else {
            applicant.immigration_status = form_data.immigration_status;
        }
    }
}

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

function check_eligibility(applicant) {
    if (applicant.pregnant) {
        return "Medicaid";
    }

    if (applicant.immigration_status['undocumented']) {
        return "Not Eligible";
    }

    if (income_household_size_check(applicant)) {
        if (applicant.immigration_status['citizen'] ||
            applicant.immigration_status['green card'] >= 5 ||
            applicant.immigration_status['asylum'] ||
            applicant.immigration_status['refugee'] ||
            applicant.immigration_status['traffic victim']) {
            return "Medicaid";
        } else {
            return "MarketPlace";
        }
    } else {
        if (applicant.immigration_status['citizen'] ||
            applicant.immigration_status['green card'] >= 5 ||
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
                if (applicant.immigration_status['green card'] < 5) {
                    return "MarketPlace";
                } else {
                    return "Medicaid";
                }
            }
        }
    }
}

function checkEligibility() {
    let form = document.getElementById('applicantForm');
    let formData = {
        income: parseInt(form.elements['income'].value),
        household_size: parseInt(form.elements['household_size'].value),
        immigration_status: form.elements['immigration_status'].value,
        age: parseInt(form.elements['age'].value),
        pregnant: form.elements['pregnant'].checked,
        chronic_condition: form.elements['chronic_condition'].checked
    };

    collect_applicant_info(formData);

    let eligibilityResult = check_eligibility(applicant);

    let resultDiv = document.getElementById('result');
    resultDiv.innerHTML = "<strong>Eligibility Result:</strong> " + eligibilityResult;
}
