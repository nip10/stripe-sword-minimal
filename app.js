// Import Stripe package
const stripe = require("stripe")(
  "rk_test_51PvL0K2KyMN4ydQA18JLXz0z5Gp1bOeuaKOYwblxbZsdfykJL3dYhQ7YU1AppDPNiRs8ocOIQjQzjnUeRKQxq1is004a0g7G4Q"
);

// Import Faker package
const { faker } = require("@faker-js/faker");

// Define a function to create a customer and subscription
async function createCustomerAndSubscription() {
  try {
    // Generate random customer data using faker
    const randomName = faker.person.fullName();
    const randomEmail = faker.internet.email();
    const randomAddress = {
      line1: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      postal_code: faker.location.zipCode(),
      country: faker.location.countryCode(),
    };

    // Step 1: Create a customer with random billing address data
    const customer = await stripe.customers.create({
      name: randomName, // Random customer name
      email: randomEmail, // Random customer email
      address: randomAddress, // Random address data
    });

    console.log(`Customer created with ID: ${customer.id}`);

    // Step 2: Create a subscription for the customer
    // monthly price_1QAWox2KyMN4ydQAviOCJKgs
    // weekly price_1QAWpV2KyMN4ydQAyHd64Z1B
    // one time price_1QAWps2KyMN4ydQAv14c3cLb
    const priceId = "price_1QAWox2KyMN4ydQAviOCJKgs"; // Replace with your actual price ID

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price: priceId,
        },
      ],
      payment_behavior: "default_incomplete", // Important to handle payments after subscription creation
      payment_settings: {
        save_default_payment_method: "on_subscription", // Save the payment method after payment
      },
      expand: ["latest_invoice.payment_intent"], // To retrieve the client secret for the payment intent
    });

    // Step 3: Log the client secret of the payment intent
    const paymentIntent = subscription.latest_invoice.payment_intent;
    if (paymentIntent) {
      console.log("Client Secret:", paymentIntent.client_secret);
    } else {
      console.log("No payment intent available");
    }
  } catch (error) {
    console.error("Error creating customer or subscription:", error);
  }
}

// Run the function
createCustomerAndSubscription();
