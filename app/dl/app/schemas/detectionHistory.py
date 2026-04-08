from jsonschema import validate
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError

detectionHistory_schema = {
    "type": "object",
    "properties": {
        "createdAt": {"type": "string"},
        "ip": {"type": "string"},
        "city": {"type": "string"},
        "district": {"type": "string"},
        "state": {"type": "string"},
        "location": {
            "type": "object",
            "properties": {"lat": {"type": "number"}, "lon": {"type": "number"}},
        },
        "detected_class": {"type": "string"},
        "rating": {"type": "number"},
    },
    # Set to True so it doesn't crash when it sees MongoDB ObjectId types
    "additionalProperties": True,
}


def validate_detectionHistory(data):
    try:
        validate(data, detectionHistory_schema)
    except ValidationError as e:
        return {"ok": False, "message": str(e)}
    except SchemaError as e:
        return {"ok": False, "message": str(e)}
    return {"ok": True, "data": data}
