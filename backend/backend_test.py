"""Hi Anzy Backend API Tests
Tests all endpoints as specified in the review request.
"""
import requests
import sys
from datetime import datetime

class HiAnzyAPITester:
    def __init__(self, base_url="https://landing-hub-856.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None, validate_fn=None):
        """Run a single API test with optional validation function"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            
            if success and validate_fn:
                try:
                    json_data = response.json()
                    validation_result = validate_fn(json_data)
                    if not validation_result:
                        success = False
                        print(f"❌ Failed - Validation failed")
                        self.failed_tests.append({"test": name, "reason": "Validation failed"})
                except Exception as e:
                    success = False
                    print(f"❌ Failed - Validation error: {str(e)}")
                    self.failed_tests.append({"test": name, "reason": f"Validation error: {str(e)}"})
            
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                if validate_fn:
                    print(f"   Validation: OK")
            else:
                if response.status_code != expected_status:
                    print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                    try:
                        print(f"   Response: {response.text[:200]}")
                    except:
                        pass
                    self.failed_tests.append({"test": name, "reason": f"Expected {expected_status}, got {response.status_code}"})

            return success, response.json() if response.status_code < 400 else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({"test": name, "reason": str(e)})
            return False, {}

    def test_health(self):
        """Test GET /api/health returns ok"""
        return self.run_test(
            "Health Check",
            "GET",
            "health",
            200,
            validate_fn=lambda r: r.get("status") == "ok"
        )

    def test_case_studies_list(self):
        """Test GET /api/case-studies returns 5 published cases"""
        success, response = self.run_test(
            "Case Studies List",
            "GET",
            "case-studies",
            200,
            validate_fn=lambda r: isinstance(r, list) and len(r) == 5
        )
        if success:
            print(f"   Found {len(response)} case studies")
        return success, response

    def test_case_studies_featured(self):
        """Test GET /api/case-studies?featured=true filter works"""
        success, response = self.run_test(
            "Case Studies Featured Filter",
            "GET",
            "case-studies",
            200,
            params={"featured": True},
            validate_fn=lambda r: isinstance(r, list) and all(c.get("featured") == True for c in r)
        )
        if success:
            print(f"   Found {len(response)} featured case studies")
        return success, response

    def test_case_study_detail(self, slug="the-storefront-was-never-the-problem"):
        """Test GET /api/case-studies/{slug} detail"""
        success, response = self.run_test(
            f"Case Study Detail ({slug})",
            "GET",
            f"case-studies/{slug}",
            200,
            validate_fn=lambda r: r.get("slug") == slug and "title" in r and "situation" in r
        )
        return success, response

    def test_network_list(self):
        """Test GET /api/network returns ~33 public resources"""
        success, response = self.run_test(
            "Network Resources List",
            "GET",
            "network",
            200,
            validate_fn=lambda r: isinstance(r, list) and len(r) >= 30
        )
        if success:
            print(f"   Found {len(response)} network resources")
        return success, response

    def test_network_category_filter(self):
        """Test GET /api/network?category=Creators filter works"""
        success, response = self.run_test(
            "Network Category Filter (Creators)",
            "GET",
            "network",
            200,
            params={"category": "Creators"},
            validate_fn=lambda r: isinstance(r, list) and all(c.get("category") == "Creators" for c in r) and len(r) > 0
        )
        if success:
            print(f"   Found {len(response)} Creators")
        return success, response

    def test_network_categories(self):
        """Test GET /api/network/categories returns ordered list"""
        success, response = self.run_test(
            "Network Categories",
            "GET",
            "network/categories",
            200,
            validate_fn=lambda r: "categories" in r and isinstance(r["categories"], list) and len(r["categories"]) > 0
        )
        if success:
            print(f"   Found {len(response.get('categories', []))} categories")
        return success, response

    def test_insights_list(self):
        """Test GET /api/insights returns 6 (list has no body field)"""
        success, response = self.run_test(
            "Insights List",
            "GET",
            "insights",
            200,
            validate_fn=lambda r: isinstance(r, list) and len(r) == 6 and all("body" not in item for item in r)
        )
        if success:
            print(f"   Found {len(response)} insights (no body field)")
        return success, response

    def test_insight_detail(self, slug="looking-busy-is-not-a-growth-strategy"):
        """Test GET /api/insights/{slug} returns body blocks"""
        success, response = self.run_test(
            f"Insight Detail ({slug})",
            "GET",
            f"insights/{slug}",
            200,
            validate_fn=lambda r: r.get("slug") == slug and "body" in r and isinstance(r["body"], list) and len(r["body"]) > 0
        )
        if success:
            print(f"   Body has {len(response.get('body', []))} blocks")
        return success, response

    def test_contact_valid(self):
        """Test POST /api/contact valid payload -> ok:true + emailSent:false + stored"""
        test_email = f"test_{datetime.now().strftime('%H%M%S')}@example.com"
        payload = {
            "name": "Test User",
            "email": test_email,
            "message": "This is a test message from the automated test suite. Please ignore."
        }
        success, response = self.run_test(
            "Contact Form Valid Submission",
            "POST",
            "contact",
            200,
            data=payload,
            validate_fn=lambda r: r.get("ok") == True and r.get("emailSent") == False and r.get("id") is not None
        )
        if success:
            print(f"   Submission ID: {response.get('id')}")
            print(f"   Email sent: {response.get('emailSent')} (expected False)")
        return success, response

    def test_contact_invalid(self):
        """Test POST /api/contact invalid payload -> 422"""
        payload = {
            "name": "T",  # too short
            "email": "invalid-email",
            "message": "short"  # too short
        }
        success, response = self.run_test(
            "Contact Form Invalid Submission",
            "POST",
            "contact",
            422,
            data=payload
        )
        return success, response

    def test_contact_honeypot(self):
        """Test POST /api/contact honeypot orgField filled -> ok:true with id:null"""
        payload = {
            "name": "Bot User",
            "email": "bot@example.com",
            "message": "This is a bot message",
            "orgField": "I am a bot"  # honeypot field
        }
        success, response = self.run_test(
            "Contact Form Honeypot",
            "POST",
            "contact",
            200,
            data=payload,
            validate_fn=lambda r: r.get("ok") == True and r.get("id") is None
        )
        return success, response

    def test_portfolio_list(self):
        """Test GET /api/portfolio returns 8 groups with category, slug, items[]"""
        success, response = self.run_test(
            "Portfolio Groups List",
            "GET",
            "portfolio",
            200,
            validate_fn=lambda r: (
                isinstance(r, list) and 
                len(r) == 8 and 
                all("category" in g and "slug" in g and "items" in g and isinstance(g["items"], list) for g in r)
            )
        )
        if success:
            print(f"   Found {len(response)} portfolio groups")
            for g in response:
                print(f"     - {g.get('category')}: {len(g.get('items', []))} items")
        return success, response

    def test_analytics_event(self):
        """Test POST /api/analytics/event -> ok"""
        payload = {
            "name": "test_event",
            "meta": {"source": "backend_test"},
            "path": "/test"
        }
        success, response = self.run_test(
            "Analytics Event",
            "POST",
            "analytics/event",
            200,
            data=payload,
            validate_fn=lambda r: r.get("ok") == True
        )
        return success, response

def main():
    print("=" * 60)
    print("Hi Anzy Backend API Test Suite")
    print("=" * 60)
    
    tester = HiAnzyAPITester()

    # Run all tests
    print("\n📋 HEALTH & CONNECTIVITY")
    tester.test_health()

    print("\n📋 CASE STUDIES")
    tester.test_case_studies_list()
    tester.test_case_studies_featured()
    tester.test_case_study_detail()

    print("\n📋 NETWORK")
    tester.test_network_list()
    tester.test_network_category_filter()
    tester.test_network_categories()

    print("\n📋 INSIGHTS")
    tester.test_insights_list()
    tester.test_insight_detail()

    print("\n📋 PORTFOLIO")
    tester.test_portfolio_list()

    print("\n📋 CONTACT FORM")
    tester.test_contact_valid()
    tester.test_contact_invalid()
    tester.test_contact_honeypot()

    print("\n📋 ANALYTICS")
    tester.test_analytics_event()

    # Print summary
    print("\n" + "=" * 60)
    print(f"📊 RESULTS: {tester.tests_passed}/{tester.tests_run} tests passed")
    print("=" * 60)
    
    if tester.failed_tests:
        print("\n❌ FAILED TESTS:")
        for fail in tester.failed_tests:
            print(f"   - {fail['test']}: {fail['reason']}")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())
