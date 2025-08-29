const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:3000/bfhl'; // Change to your deployed URL when testing production

// Test cases
const testCases = [
    {
        name: "Example A",
        data: {
            data: ["a", "1", "334", "4", "R", "$"]
        },
        expected: {
            odd_numbers: ["1"],
            even_numbers: ["334", "4"],
            alphabets: ["A", "R"],
            special_characters: ["$"],
            sum: "339",
            concat_string: "rA"
        }
    },
    {
        name: "Example B",
        data: {
            data: ["2", "a", "y", "4", "&", "-", "*", "5", "92", "b"]
        },
        expected: {
            odd_numbers: ["5"],
            even_numbers: ["2", "4", "92"],
            alphabets: ["A", "Y", "B"],
            special_characters: ["&", "-", "*"],
            sum: "103",
            concat_string: "bYa"
        }
    },
    {
        name: "Mixed data with multiple special characters",
        data: {
            data: ["@", "3", "x", "7", "#", "Y", "2", "!", "z"]
        },
        expected: {
            odd_numbers: ["3", "7"],
            even_numbers: ["2"],
            alphabets: ["X", "Y", "Z"],
            special_characters: ["@", "#", "!"],
            sum: "12",
            concat_string: "zYx"
        }
    },
    {
        name: "Only numbers",
        data: {
            data: ["10", "21", "32", "43"]
        },
        expected: {
            odd_numbers: ["21", "43"],
            even_numbers: ["10", "32"],
            alphabets: [],
            special_characters: [],
            sum: "106",
            concat_string: ""
        }
    },
    {
        name: "Only alphabets",
        data: {
            data: ["a", "B", "c", "D"]
        },
        expected: {
            odd_numbers: [],
            even_numbers: [],
            alphabets: ["A", "B", "C", "D"],
            special_characters: [],
            sum: "0",
            concat_string: "dCbA"
        }
    }
];

// Function to test the API
async function testAPI() {
    console.log('🚀 Starting API Tests...\n');
    
    for (const test of testCases) {
        console.log(`\n📝 Test: ${test.name}`);
        console.log('Request:', JSON.stringify(test.data, null, 2));
        
        try {
            const response = await axios.post(API_URL, test.data);
            const result = response.data;
            
            console.log('Response:', JSON.stringify(result, null, 2));
            
            // Validate response structure
            if (result.is_success && result.user_id && result.email && result.roll_number) {
                console.log('✅ Response structure is valid');
                
                // Check expected values
                let allMatch = true;
                for (const [key, expectedValue] of Object.entries(test.expected)) {
                    const actualValue = result[key.replace(/_/g, '_')];
                    if (JSON.stringify(actualValue) !== JSON.stringify(expectedValue)) {
                        console.log(`❌ Mismatch in ${key}: Expected ${JSON.stringify(expectedValue)}, Got ${JSON.stringify(actualValue)}`);
                        allMatch = false;
                    }
                }
                
                if (allMatch) {
                    console.log('✅ All values match expected results');
                }
            } else {
                console.log('❌ Response structure is invalid');
            }
            
        } catch (error) {
            console.error('❌ Test failed:', error.message);
            if (error.response) {
                console.error('Response:', error.response.data);
            }
        }
    }
    
    console.log('\n\n🏁 Testing completed!');
}

// Run tests
testAPI().catch(console.error);