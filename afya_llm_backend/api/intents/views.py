from flask import Blueprint, request, jsonify, Response

name = "intents"
bp = Blueprint(name, __name__)

intents = ["emergency"]

@bp.route("/intents/<intent>", methods=["POST"])
def post(intent):
    data = request.json

    if not data:
        return Response("No data provided", status=400)
    
    message = data.get("message")
    
    if intent in intents:
        if intent == "emergency":
            response = emergency_intent(message)
            return jsonify(response)
        else:
            return jsonify({"error": f"Intent '{intent}' is not yet supported."})
    else:
        return jsonify({"error": "Intent type not found"}), 404

# Response Type Functions

def text_response(text, enable_input=True):
    return {
        "sender": "ai",
        "text": text,
        "props": "enable_input" if enable_input else "disable_input"
    }

def buttons_response(text, actions, enable_input=False):
    return {
        "sender": "ai",
        "props": "disable_input" if not enable_input else "enable_input",
        "button_response": {
            "text": text,
            "actions": [
                {"id": action["id"], "title": action["title"]} for action in actions
            ]
        }
    }

def input_response(text):
    return text_response(text, enable_input=True)



######################################################################################################
# Emergency Intent Function with Various Response Types

def emergency_intent(message):
    if not message:
        return text_response("Message content is empty", enable_input=True)
    
    # Greeting responses
    if message.lower() in ["Thanks", "Thank you", "Asante", "cool"]:
        return text_response("Wow, am glad to have helped you! Have a nice day", enable_input=True)

    # Initial emergency response options
    elif message.lower() in ["hello", "hi", "habari"]:
        actions = [
            {"id": 1, "title": "Call Emergency Services"},
            {"id": 2, "title": "Need Urgent Medical Advice"},
            {"id": 3, "title": "Find Nearby Hospital"},
            {"id": 4, "title": "Locate Nearby Pharmacy"}
        ]
        return buttons_response("Hello, welcome to the emergency support service. How can we assist you?", actions)
    
    # Specific action handlers
    elif message.lower() == "call emergency services":
        return text_response(
            "Dialing emergency services for immediate assistance. For local emergency numbers in Tanzania, dial 112.",
            enable_input=False
        )
    
    elif message.lower() == "need urgent medical advice":
        actions = [
            {"id": 1, "title": "Speak with a Medical Officer"},
            {"id": 2, "title": "Get First Aid Advice"}
        ]
        return buttons_response("Would you like to speak with a medical officer or get first aid advice?", actions)

    elif message.lower() == "find nearby hospital":
        # Example of simulating hospital location results
        return text_response(
            "We are finding nearby hospitals for you. Some options include:\n- Muhimbili National Hospital\n- Aga Khan Hospital\n- Regency Medical Center",
            enable_input=False
        )
    
    elif message.lower() == "locate nearby pharmacy":
        # Example of simulating pharmacy location results
        return text_response(
            "Here are some popular pharmacies:\n- Shelys Pharmacy\n- Alpha Pharmacy\n- Duka la Dawa Muhimu",
            enable_input=False
        )
    
    # For unrecognized messages
    else:
        return text_response("Sorry, we didn't understand your request. Please clarify what kind of assistance you need.", enable_input=True)

##################################################################################################
# TYPESE OF RESPONSES
##################################################################################################

# 1. TEXT RESPONSE
#    - json {"text": "something here...", "props": "enable_input"}

# 2. BUTTONS RESPONSE
#    - json
    """_summary_

        {
            "props": "disable_input"
            "button_response": {
                "text": "some text here...",
                "actions": [
                   {
                        "id": number,
                         "title": "some text here..."
                   }
                ]
            }
        }
    
    """
# 1. INPUT RESPONSE
#    - json {"text": "something here...", "props": "enable_input"}