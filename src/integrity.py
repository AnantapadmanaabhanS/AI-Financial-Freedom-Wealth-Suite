import hashlib
import json

def generate_record_hash(user_profile):
    """
    Computes deterministic SHA-256 cryptographic hash of financial record for tamper verification.
    Demonstrates decentralized cryptographic record integrity.
    """
    # Sort keys for deterministic JSON serialization
    serialized_data = json.dumps(user_profile, sort_keys=True, default=str)
    record_hash = hashlib.sha256(serialized_data.encode('utf-8')).hexdigest()
    return record_hash

def verify_record_integrity(user_profile, expected_hash):
    """
    Verifies if current record matches stored cryptographic hash proof.
    """
    current_hash = generate_record_hash(user_profile)
    is_valid = (current_hash == expected_hash)
    return is_valid, current_hash
