import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Pet from '../models/Pet.js';

// ─── Utilities ───────────────────────────────────────────────────────
function sendMockSMS(phone, message) {
    if (phone) {
        console.log(`\n📱 [MOCK SMS ALERT]`);
        console.log(`   To: ${phone}`);
        console.log(`   Message: ${message}\n`);
    }
}


// ─── Intent Detection ────────────────────────────────────────────────
const INTENTS = [
    {
        name: 'greeting',
        patterns: [/^(hi|hello|hey|howdy|good\s*(morning|afternoon|evening)|sup|yo)/i]
    },
    {
        name: 'book_appointment',
        patterns: [/\b(book|appointment|schedule|reserve|set\s*up)\b/i]
    },
    {
        name: 'booking_count',
        patterns: [/\b(how\s*many|count|number\s*of|my)\b.*\b(booking|appointment)/i, /\b(booking|appointment)\s*(count|status|list|history)/i]
    },
    {
        name: 'find_sitter',
        patterns: [/\b(find|search|available|looking\s*for|show|list)\b.*\b(sitter|walker|groomer|caretaker)/i, /\bwho\s*can\s*(help|sit|walk|groom)/i]
    },
    {
        name: 'services_info',
        patterns: [/\b(service|pricing|price|cost|how\s*much|what\s*do\s*you\s*offer|what\s*can)/i]
    },
    {
        name: 'help',
        patterns: [/\b(help|support|assist|guide|what\s*can\s*you\s*do)\b/i]
    },
    {
        name: 'cancel_booking',
        patterns: [/\b(cancel|remove|delete)\b.*\b(booking|appointment)/i]
    },
    {
        name: 'thanks',
        patterns: [/\b(thank|thanks|thx|ty|appreciate)\b/i]
    }
];

function detectIntent(message) {
    for (const intent of INTENTS) {
        for (const pattern of intent.patterns) {
            if (pattern.test(message)) {
                return intent.name;
            }
        }
    }
    return 'unknown';
}

// ─── Service Types ───────────────────────────────────────────────────
const SERVICE_TYPES = ['Dog Walking', 'Pet Sitting', 'House Sitting', 'Grooming', 'Drop-in Visits'];

function matchService(input) {
    const lower = input.toLowerCase();
    for (const svc of SERVICE_TYPES) {
        if (lower.includes(svc.toLowerCase()) || lower.includes(svc.split(' ')[0].toLowerCase())) {
            return svc;
        }
    }
    // Number-based selection
    const num = parseInt(lower);
    if (num >= 1 && num <= SERVICE_TYPES.length) {
        return SERVICE_TYPES[num - 1];
    }
    return null;
}

function parseDate(input) {
    const lower = input.toLowerCase().trim();
    const now = new Date();

    if (lower === 'today') return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (lower === 'tomorrow') {
        const d = new Date(now);
        d.setDate(d.getDate() + 1);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }
    // Try parsing a date string
    const parsed = new Date(input);
    if (!isNaN(parsed.getTime()) && parsed >= now) {
        return parsed;
    }
    return null;
}

// ─── Response Builders ───────────────────────────────────────────────
function greetingResponse(userName) {
    return {
        reply: `Hello ${userName}! 🐾 Welcome to the PAWKIESS reception desk!\n\nI'm your virtual receptionist. Here's how I can help:\n\n🗓️ **Book an Appointment** — Schedule pet care services\n📊 **Check My Bookings** — View your booking count & status\n🔍 **Find a Sitter** — Browse available pet sitters\n❓ **Ask Questions** — Learn about our services & pricing\n\nWhat would you like to do?`,
        suggestions: ['Book Appointment', 'My Bookings', 'Find a Sitter', 'Services & Pricing']
    };
}

function helpResponse() {
    return {
        reply: `Please write your doubt or question, and our support team will get back to you soon.`,
        conversationState: {
            flow: 'support',
            supportStep: 'waiting_doubt'
        },
        suggestions: []
    };
}

function servicesResponse() {
    return {
        reply: `Here are our available services at PAWKIESS 🐾\n\n🐕 **Dog Walking** — Regular walks for your furry friend\n🏠 **Pet Sitting** — In-home care while you're away\n🏡 **House Sitting** — A sitter stays at your home\n✂️ **Grooming** — Bathing, haircuts, and nail trimming\n👀 **Drop-in Visits** — Quick check-ins and feeding\n\nPricing varies by sitter. Want me to help you find a sitter or book an appointment?`,
        suggestions: ['Book Appointment', 'Find a Sitter']
    };
}

function thanksResponse() {
    return {
        reply: `You're welcome! 🐾💕 Happy to help! If you need anything else, just ask. Have a pawsome day! 🐶`,
        suggestions: ['Book Appointment', 'My Bookings', 'Help']
    };
}

function unknownResponse() {
    return {
        reply: `I'm not sure I understood that 🤔 But no worries! Here are some things I can help with:\n\n🗓️ **Book an Appointment**\n📊 **Check My Bookings**\n🔍 **Find a Sitter**\n💰 **Services & Pricing**\n\nTry asking one of those, or type **"help"** for more options!`,
        suggestions: ['Book Appointment', 'My Bookings', 'Find a Sitter', 'Help']
    };
}

// ─── Booking Flow State Machine ──────────────────────────────────────
async function handleBookingFlow(message, state, userId) {
    const bookingState = state.bookingData || {};
    const step = state.bookingStep || 'select_service';

    switch (step) {
        case 'select_service': {
            const serviceList = SERVICE_TYPES.map((s, i) => `${i + 1}. ${s}`).join('\n');
            return {
                reply: `Great, let's book an appointment! 🗓️\n\nWhich service would you like?\n\n${serviceList}\n\nPlease type the service name or number.`,
                conversationState: {
                    flow: 'booking',
                    bookingStep: 'waiting_service',
                    bookingData: {}
                },
                suggestions: SERVICE_TYPES
            };
        }

        case 'waiting_service': {
            const service = matchService(message);
            if (!service) {
                return {
                    reply: `I didn't recognize that service. Please choose from:\n\n${SERVICE_TYPES.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nType the name or number.`,
                    conversationState: state,
                    suggestions: SERVICE_TYPES
                };
            }
            return {
                reply: `Excellent choice! **${service}** it is! ✅\n\nWhen would you like the appointment? You can say:\n- **"today"** or **"tomorrow"**\n- Or type a specific date (e.g., **2026-04-15**)`,
                conversationState: {
                    flow: 'booking',
                    bookingStep: 'waiting_date',
                    bookingData: { ...bookingState, serviceType: service }
                },
                suggestions: ['Today', 'Tomorrow']
            };
        }

        case 'waiting_date': {
            const date = parseDate(message);
            if (!date) {
                return {
                    reply: `I couldn't understand that date. Please try:\n- **"today"** or **"tomorrow"**\n- Or a specific date like **2026-04-15**`,
                    conversationState: state,
                    suggestions: ['Today', 'Tomorrow']
                };
            }
            // Find available sitters
            const sitters = await User.find({ role: 'pet_sitter' }).select('name sitterProfile phone').lean();
            if (sitters.length === 0) {
                return {
                    reply: `Unfortunately, there are no sitters registered on the platform yet. 😔\n\nPlease check back later or contact support. Would you like to do something else?`,
                    conversationState: { flow: null },
                    suggestions: ['Help', 'My Bookings']
                };
            }
            const sitterList = sitters.map((s, i) =>
                `${i + 1}. **${s.name}** — ${s.sitterProfile?.services?.join(', ') || 'General Care'} | ₹${s.sitterProfile?.price || 'N/A'}/session`
            ).join('\n');

            return {
                reply: `📅 Date set to **${date.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}**\n\nHere are our available sitters:\n\n${sitterList}\n\nType the sitter's number or name to select one.`,
                conversationState: {
                    flow: 'booking',
                    bookingStep: 'waiting_sitter',
                    bookingData: { ...bookingState, startDate: date.toISOString(), sitterOptions: sitters.map(s => ({ id: s._id.toString(), name: s.name, price: s.sitterProfile?.price || 0 })) }
                },
                suggestions: sitters.slice(0, 3).map(s => s.name)
            };
        }

        case 'waiting_sitter': {
            const options = bookingState.sitterOptions || [];
            const lower = message.toLowerCase().trim();
            let selectedSitter = null;

            // Try number
            const num = parseInt(lower);
            if (num >= 1 && num <= options.length) {
                selectedSitter = options[num - 1];
            } else {
                // Try name match
                selectedSitter = options.find(s => s.name.toLowerCase().includes(lower));
            }

            if (!selectedSitter) {
                return {
                    reply: `I couldn't find that sitter. Please type their number or name from the list above.`,
                    conversationState: state,
                    suggestions: options.slice(0, 3).map(s => s.name)
                };
            }

            const price = selectedSitter.price || 500;
            return {
                reply: `You've selected **${selectedSitter.name}** 👍\n\n📋 **Booking Summary:**\n━━━━━━━━━━━━━━━━━━\n🐾 Service: **${bookingState.serviceType}**\n📅 Date: **${new Date(bookingState.startDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}**\n👤 Sitter: **${selectedSitter.name}**\n💰 Price: **₹${price}**\n━━━━━━━━━━━━━━━━━━\n\nWould you like to **confirm** this booking?`,
                conversationState: {
                    flow: 'booking',
                    bookingStep: 'waiting_confirm',
                    bookingData: {
                        ...bookingState,
                        petSitterId: selectedSitter.id,
                        petSitterName: selectedSitter.name,
                        totalPrice: price,
                        sitterOptions: undefined // Clean up
                    }
                },
                suggestions: ['Confirm', 'Cancel']
            };
        }

        case 'waiting_confirm': {
            const lower = message.toLowerCase().trim();
            if (['yes', 'confirm', 'ok', 'sure', 'go ahead', 'book it', 'y'].includes(lower)) {
                try {
                    // Find user's pets
                    const pets = await Pet.find({ owner: userId }).lean();
                    const petIds = pets.length > 0 ? [pets[0]._id] : [];

                    const startDate = new Date(bookingState.startDate);
                    const endDate = new Date(startDate);
                    endDate.setHours(endDate.getHours() + 2); // 2-hour default session

                    const booking = await Booking.create({
                        petOwner: userId,
                        petSitter: bookingState.petSitterId,
                        pets: petIds,
                        startDate,
                        endDate,
                        serviceType: bookingState.serviceType,
                        totalPrice: bookingState.totalPrice || 500,
                        notes: `Booked via Receptionist Chatbot`,
                        status: 'pending'
                    });

                    // Fetch complete sitter and owner details for SMS and Maps
                    const sitter = await User.findById(bookingState.petSitterId).select('name phone location');
                    const owner = await User.findById(userId).select('name phone location');

                    // Mock SMS Notification
                    if (sitter && sitter.phone) {
                        sendMockSMS(
                            sitter.phone, 
                            `Hi ${sitter.name}, you have a new ${bookingState.serviceType} booking request from ${owner.name} for ${startDate.toLocaleDateString()}. Please check the app to confirm.`
                        );
                    }

                    // Google Maps link generation
                    let mapsLink = "";
                    const sitterAddress = sitter?.location?.address || `${sitter?.location?.city || ''} ${sitter?.location?.state || ''}`.trim();
                    const ownerAddress = owner?.location?.address || `${owner?.location?.city || ''} ${owner?.location?.state || ''}`.trim();

                    if (sitterAddress && sitterAddress.length > 3) {
                        mapsLink = `\n📍 **Sitter Location:** [View on Google Maps](https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(sitterAddress)})`;
                    } else if (ownerAddress && ownerAddress.length > 3) {
                        mapsLink = `\n📍 **Owner Location:** [View on Google Maps](https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ownerAddress)})`;
                    } else {
                        mapsLink = `\n📍 **Location:** Please coordinate directly via chat.`;
                    }

                    return {
                        reply: `✅ **Booking Confirmed!** 🎉\n\n📋 **Booking ID:** ${booking._id}\n🐾 **Service:** ${bookingState.serviceType}\n📅 **Date:** ${startDate.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n👤 **Sitter:** ${bookingState.petSitterName}\n💰 **Price:** ₹${bookingState.totalPrice}\n📌 **Status:** Pending confirmation from sitter${mapsLink}\n\nYour sitter has been notified via SMS and will review the booking soon. Is there anything else I can help with?`,
                        conversationState: { flow: null },
                        suggestions: ['My Bookings', 'Book Another', 'Help']
                    };
                } catch (error) {
                    console.error('Booking creation error:', error);
                    return {
                        reply: `❌ Oops! Something went wrong while creating the booking. Error: ${error.message}\n\nPlease try again or contact support.`,
                        conversationState: { flow: null },
                        suggestions: ['Book Appointment', 'Help']
                    };
                }
            } else if (['no', 'cancel', 'nah', 'nope', 'n'].includes(lower)) {
                return {
                    reply: `No problem! The booking has been cancelled. 👋\n\nWould you like to start over or do something else?`,
                    conversationState: { flow: null },
                    suggestions: ['Book Appointment', 'My Bookings', 'Help']
                };
            } else {
                return {
                    reply: `Please type **"Confirm"** to book or **"Cancel"** to discard.`,
                    conversationState: state,
                    suggestions: ['Confirm', 'Cancel']
                };
            }
        }

        default:
            return {
                reply: `Something went wrong with the booking flow. Let's start over!`,
                conversationState: { flow: null },
                suggestions: ['Book Appointment', 'Help']
            };
    }
}

// ─── Main Controller ─────────────────────────────────────────────────
// @desc    Chat with AI Receptionist
// @route   POST /api/receptionist/chat
// @access  Private
export const receptionistChat = async (req, res) => {
    try {
        const { message, conversationState } = req.body;
        const userId = req.user._id;
        const userName = req.user.name || 'there';

        if (!message || typeof message !== 'string') {
            return res.status(400).json({ message: 'Message is required' });
        }

        const state = conversationState || {};

        // If we're in the middle of a booking flow, continue it
        if (state.flow === 'booking') {
            const result = await handleBookingFlow(message, state, userId);
            return res.json(result);
        }

        // If we're waiting for the user to provide their support question
        if (state.flow === 'support') {
            if (state.supportStep === 'waiting_doubt') {
                return res.json({
                    reply: `Thank you. We will see through it and be back soon! 🐾`,
                    conversationState: { flow: null },
                    suggestions: ['Book Appointment', 'My Bookings', 'Find a Sitter']
                });
            }
        }

        // Otherwise detect intent from the new message
        const intent = detectIntent(message);

        switch (intent) {
            case 'greeting':
                return res.json(greetingResponse(userName));

            case 'book_appointment':
                const bookResult = await handleBookingFlow(message, { bookingStep: 'select_service' }, userId);
                return res.json(bookResult);

            case 'booking_count': {
                const totalBookings = await Booking.countDocuments({ petOwner: userId });
                const pendingCount = await Booking.countDocuments({ petOwner: userId, status: 'pending' });
                const acceptedCount = await Booking.countDocuments({ petOwner: userId, status: 'accepted' });
                const completedCount = await Booking.countDocuments({ petOwner: userId, status: 'completed' });
                const cancelledCount = await Booking.countDocuments({ petOwner: userId, status: 'cancelled' });

                return res.json({
                    reply: `📊 **Your Booking Summary:**\n\n📦 **Total Bookings:** ${totalBookings}\n⏳ **Pending:** ${pendingCount}\n✅ **Accepted:** ${acceptedCount}\n🎉 **Completed:** ${completedCount}\n❌ **Cancelled:** ${cancelledCount}\n\nWould you like to book a new appointment or need any other help?`,
                    suggestions: ['Book Appointment', 'Find a Sitter', 'Help']
                });
            }

            case 'find_sitter': {
                const sitters = await User.find({ role: 'pet_sitter' })
                    .select('name sitterProfile phone location')
                    .lean();

                if (sitters.length === 0) {
                    return res.json({
                        reply: `😔 No pet sitters are registered on the platform yet. Check back soon!\n\nIs there anything else I can help with?`,
                        suggestions: ['Book Appointment', 'Help']
                    });
                }

                const sitterList = sitters.map((s, i) =>
                    `${i + 1}. **${s.name}**\n   🐾 Services: ${s.sitterProfile?.services?.join(', ') || 'General Care'}\n   💰 Price: ₹${s.sitterProfile?.price || 'Contact for pricing'}\n   ⭐ Rating: ${s.sitterProfile?.rating || 'New'}/5`
                ).join('\n\n');

                return res.json({
                    reply: `🔍 **Available Pet Sitters:**\n\n${sitterList}\n\nWould you like to book an appointment with any of them?`,
                    suggestions: ['Book Appointment', 'Help']
                });
            }

            case 'services_info':
                return res.json(servicesResponse());

            case 'cancel_booking': {
                const recentBooking = await Booking.findOne({
                    petOwner: userId,
                    status: { $in: ['pending', 'accepted'] }
                }).sort({ createdAt: -1 }).populate('petSitter', 'name');

                if (!recentBooking) {
                    return res.json({
                        reply: `You don't have any active bookings to cancel. 🤷‍♂️\n\nWould you like to do something else?`,
                        suggestions: ['Book Appointment', 'My Bookings', 'Help']
                    });
                }

                recentBooking.status = 'cancelled';
                await recentBooking.save();

                return res.json({
                    reply: `✅ Your most recent booking has been cancelled:\n\n🐾 **Service:** ${recentBooking.serviceType}\n📅 **Date:** ${new Date(recentBooking.startDate).toLocaleDateString('en-IN')}\n👤 **Sitter:** ${recentBooking.petSitter?.name || 'N/A'}\n\nIs there anything else I can help with?`,
                    suggestions: ['Book Appointment', 'My Bookings', 'Help']
                });
            }

            case 'help':
                return res.json(helpResponse());

            case 'thanks':
                return res.json(thanksResponse());

            default:
                return res.json(unknownResponse());
        }
    } catch (error) {
        console.error('Receptionist chat error:', error);
        res.status(500).json({
            reply: `❌ Oops! Something went wrong on my end. Please try again in a moment.`,
            suggestions: ['Help']
        });
    }
};
