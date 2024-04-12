// Define applicant data structure
let applicant = {
    income: 0,
    household_size: 0,
    immigration_status: {
        "citizen":null,
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

// Function to collect applicant information. not sure how you will approach this, I would probably use a JSON object
function collect_applicant_info(form_data) {
    applicant.income = form_data.income;
    applicant.household_size = form_data.household_size;
    applicant.age = form_data.age;
    applicant.pregnant = form_data.pregnant;
    applicant.chronic_condition = form_data.chronic_condition;

    // since i am not sure if you will pass an object here I decided to check for either a string or an object
    if (typeof form_data.immigration_status === 'string') {
        // Convert the string to an object
        applicant.immigration_status[form_data.immigration_status] = true;
    } else {
        // Check if 'green card' is present in form_data.immigration_status
        if (form_data.immigration_status['green card'] !== undefined) {
            applicant.immigration_status['green card'] = form_data.immigration_status['green card'];
        } else {
            // If 'green card' is not present, copy the entire immigration status
            applicant.immigration_status = form_data.immigration_status;
        }
    }
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
                // Check if the green card value is less than 5 for MarketPlace eligibility
                if (applicant.immigration_status['green card'] < 5) {
                    return "MarketPlace";
                } else {
                    return "Medicaid";
                }
            }
        }
    }
}


function test_cases(){

    let test1 = () =>{
        let a = {
            income: 19000,
            household_size: 1,
            immigration_status: "citizen",
            age: 33,
            pregnant: false,
            chronic_condition: false
        }
        collect_applicant_info(a);
        let eligibilityResult = check_eligibility(applicant);
        console.log("test 1 Expected Medicaid, Result was: ", eligibilityResult);
    }

    let test2 = () =>{
        let a = {
            income: 28000,
            household_size: 1,
            immigration_status: "citizen",
            age: 33,
            pregnant: false,
            chronic_condition: false
        }

        collect_applicant_info(a);
        let eligibilityResult = check_eligibility(applicant);
        console.log("test 2 Expected MarketPlace, Result was: ", eligibilityResult);
    }

    let test3 = () =>{
        let a = {
            income: 0,
            household_size: 1,
            immigration_status: "citizen",
            age: 11,
            pregnant: false,
            chronic_condition: false
        }

        collect_applicant_info(a);
        let eligibilityResult = check_eligibility(applicant);
        console.log("test 3 Expected Medicaid, Result was: ", eligibilityResult);
    }
    let test4 = () =>{
        let a = {
            income: 10000,
            household_size: 1,
            immigration_status: {"green card": 1 },
            age: 33,
            pregnant: false,
            chronic_condition: false
        }

        collect_applicant_info(a);
        let eligibilityResult = check_eligibility(applicant);
        console.log("test 4 Expected MarketPlace, Result was: ", eligibilityResult);
    }
    let test5 = () =>{
        let a = {
            income: 10000,
            household_size: 1,
            immigration_status: {"green card": 9},
            age: 33,
            pregnant: false,
            chronic_condition: false
        }

        collect_applicant_info(a);
        let eligibilityResult = check_eligibility(applicant);
        console.log("test 5 Expected Medicaid, Result was: ", eligibilityResult);
    }

    let test6 = () =>{
        let a = {
            income: 100000,
            household_size: 1,
            immigration_status: {"green card": 9},
            age: 33,
            pregnant: true,
            chronic_condition: false
        }

        collect_applicant_info(a);
        let eligibilityResult = check_eligibility(applicant);
        console.log("test 6 Expected Medicaid, Result was: ", eligibilityResult);
    }
    let test7 = () => {
        let a = {
            income: 40000,
            household_size: 2,
            immigration_status: {"citizen": true, "green card": 3},
            age: 25,
            pregnant: false,
            chronic_condition: true
        }
        collect_applicant_info(a);
        let eligibilityResult = check_eligibility(applicant);
        console.log("test 7 Expected MarketPlace, Result was: ", eligibilityResult);
    }

    let test8 = () => {
        let a = {
            income: 15000,
            household_size: 4,
            immigration_status: {"visa": true},
            age: 40,
            pregnant: false,
            chronic_condition: false
        }
        collect_applicant_info(a);
        let eligibilityResult = check_eligibility(applicant);
        console.log("test 8 Expected MarketPlace, Result was: ", eligibilityResult);
    }

    let test9 = () => {
        let a = {
            income: 25000,
            household_size: 3,
            immigration_status: {"undocumented": true},
            age: 30,
            pregnant: false,
            chronic_condition: false
        }
        collect_applicant_info(a);
        let eligibilityResult = check_eligibility(applicant);
        console.log("test 9 Expected Not Eligible, Result was: ", eligibilityResult);
    }

    let test10 = () => {
        let a = {
            income: 30000,
            household_size: 5,
            immigration_status: {"refugee": true},
            age: 25,
            pregnant: true,
            chronic_condition: false
        }
        collect_applicant_info(a);
        let eligibilityResult = check_eligibility(applicant);
        console.log("test 10 Expected Medicaid, Result was: ", eligibilityResult);
    }

    let test11 = () => {
        let a = {
            income: 60000,
            household_size: 3,
            immigration_status: {"citizen": true},
            age: 55,
            pregnant: false,
            chronic_condition: true
        }
        collect_applicant_info(a);
        let eligibilityResult = check_eligibility(applicant);
        console.log("test 11 Expected MarketPlace, Result was: ", eligibilityResult);
    }

    let test12 = () => {
        let a = {
            income: 120000,
            household_size: 1,
            immigration_status: {"green card": 0},
            age: 6,
            pregnant: false,
            chronic_condition: false
        }
        collect_applicant_info(a);
        let eligibilityResult = check_eligibility(applicant);
        console.log("test 12 Expected MCHP, Result was: ", eligibilityResult);
    }

    let test13 = () => {
        let a = {
            income: 35000,
            household_size: 2,
            immigration_status: {"parole": true},
            age: 20,
            pregnant: true,
            chronic_condition: true
        }
        collect_applicant_info(a);
        let eligibilityResult = check_eligibility(applicant);
        console.log("test 13 Expected Medicaid, Result was: ", eligibilityResult);
    }

    let test14 = () => {
        let a = {
            income: 50000,
            household_size: 4,
            immigration_status: {"citizen": true},
            age: 70,
            pregnant: false,
            chronic_condition: true
        }
        collect_applicant_info(a);
        let eligibilityResult = check_eligibility(applicant);
        console.log("test 14 Expected MarketPlace, Result was: ", eligibilityResult);
    }

    let test15 = () => {
        let a = {
            income: 10000,
            household_size: 3,
            immigration_status: {"tps": true},
            age: 40,
            pregnant: false,
            chronic_condition: false
        }
        collect_applicant_info(a);
        let eligibilityResult = check_eligibility(applicant);
        console.log("test 15 Expected MarketPlace, Result was: ", eligibilityResult);
    }

    let test16 = () => {
        let a = {
            income: 60000,
            household_size: 5,
            immigration_status: {"green card": 6},
            age: 30,
            pregnant: false,
            chronic_condition: false
        }
        collect_applicant_info(a);
        let eligibilityResult = check_eligibility(applicant);
        console.log("test 16 Expected MarketPlace, Result was: ", eligibilityResult);
    }

    let test17 = () => {
        let a = {
            income: 20000,
            household_size: 1,
            immigration_status: {"asylum": true},
            age: 60,
            pregnant: false,
            chronic_condition: false
        }
        collect_applicant_info(a);
        let eligibilityResult = check_eligibility(applicant);
        console.log("test 17 Expected Medicaid, Result was: ", eligibilityResult);
    }

    test1();
    test2();
    test3();
    test4();
    test5();
    test6();
    test7();
    test8();
    test9();
    test10();
    test11();
    test12();
    test13();
    test14();
    test15();
    test16();
    test17();

}
test_cases();