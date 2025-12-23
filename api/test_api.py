"""
Test script untuk SOLVIA Backend API
Run this to test the chemistry engine
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    print("\n=== Testing Health Check ===")
    response = requests.get(f"{BASE_URL}/")
    print(json.dumps(response.json(), indent=2))

def test_get_chemicals():
    print("\n=== Testing Get Chemicals ===")
    response = requests.get(f"{BASE_URL}/api/chemicals")
    data = response.json()
    print(f"Total chemicals: {len(data['chemicals'])}")
    for chem_id, chem in list(data['chemicals'].items())[:3]:
        print(f"  - {chem_id}: {chem['name']} (pH: {chem['pH']})")

def test_add_hcl():
    print("\n=== Testing Add HCl (10mL, 1M) ===")
    response = requests.post(
        f"{BASE_URL}/api/mixture/add",
        json={
            "chemical_id": "HCl",
            "volume": 10.0,
            "molarity": 1.0
        }
    )
    data = response.json()
    state = data['mixture_state']
    print(f"pH: {state['current_pH']:.2f}")
    print(f"Reaction: {state['reaction_name']}")
    print(f"Description: {state['description']}")

def test_neutralization():
    print("\n=== Testing Neutralization (HCl + NaOH) ===")
    
    # Reset first
    requests.post(f"{BASE_URL}/api/mixture/reset")
    
    # Add HCl
    print("Adding 10mL HCl (1M)...")
    response = requests.post(
        f"{BASE_URL}/api/mixture/add",
        json={"chemical_id": "HCl", "volume": 10.0, "molarity": 1.0}
    )
    state = response.json()['mixture_state']
    print(f"  pH after HCl: {state['current_pH']:.2f}")
    
    # Add NaOH
    print("Adding 10mL NaOH (1M)...")
    response = requests.post(
        f"{BASE_URL}/api/mixture/add",
        json={"chemical_id": "NaOH", "volume": 10.0, "molarity": 1.0}
    )
    state = response.json()['mixture_state']
    print(f"  pH after neutralization: {state['current_pH']:.2f}")
    print(f"  Reaction: {state['reaction_name']}")
    print(f"  Description: {state['description']}")

def test_weak_acid():
    print("\n=== Testing Weak Acid (CH3COOH) ===")
    
    # Reset first
    requests.post(f"{BASE_URL}/api/mixture/reset")
    
    # Add weak acid
    response = requests.post(
        f"{BASE_URL}/api/mixture/add",
        json={"chemical_id": "CH3COOH", "volume": 10.0, "molarity": 0.1}
    )
    state = response.json()['mixture_state']
    print(f"pH: {state['current_pH']:.2f}")
    print(f"Expected: ~2.87 (for 0.1M CH3COOH)")

def test_indicator():
    print("\n=== Testing Indicator (Phenolphthalein) ===")
    
    # Reset first
    requests.post(f"{BASE_URL}/api/mixture/reset")
    
    # Add base
    requests.post(
        f"{BASE_URL}/api/mixture/add",
        json={"chemical_id": "NaOH", "volume": 10.0, "molarity": 0.1}
    )
    
    # Add phenolphthalein
    response = requests.post(
        f"{BASE_URL}/api/mixture/add",
        json={"chemical_id": "PP", "volume": 1.0, "molarity": 0.01}
    )
    state = response.json()['mixture_state']
    print(f"pH: {state['current_pH']:.2f}")
    print(f"Reaction: {state['reaction_name']}")
    print(f"Color (BGR): {state['current_color']}")
    print("Expected: Pink color (pH > 8.3)")

if __name__ == "__main__":
    print("=" * 60)
    print("SOLVIA Backend API Test Suite")
    print("=" * 60)
    print("\nMake sure the server is running: python api/main.py")
    print("Or: uvicorn api.main:app --reload")
    
    try:
        test_health()
        test_get_chemicals()
        test_add_hcl()
        test_neutralization()
        test_weak_acid()
        test_indicator()
        
        print("\n" + "=" * 60)
        print("✅ All tests completed!")
        print("=" * 60)
        
    except requests.exceptions.ConnectionError:
        print("\n❌ Error: Could not connect to server")
        print("Please start the server first:")
        print("  cd api && python main.py")
    except Exception as e:
        print(f"\n❌ Error: {e}")
