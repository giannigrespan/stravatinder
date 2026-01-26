import requests
import sys
import json
from datetime import datetime

class GravelMatchAPITester:
    def __init__(self, base_url="https://e5947c78-4a59-4645-af4a-be29a59b63f4.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            print(f"❌ {name} - {details}")
            self.failed_tests.append({"test": name, "error": details})
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            
            if success:
                self.log_test(name, True)
                try:
                    return True, response.json()
                except:
                    return True, response.text
            else:
                error_msg = f"Expected {expected_status}, got {response.status_code}"
                try:
                    error_detail = response.json().get('detail', '')
                    if error_detail:
                        error_msg += f" - {error_detail}"
                except:
                    pass
                self.log_test(name, False, error_msg)
                return False, {}

        except requests.exceptions.Timeout:
            self.log_test(name, False, "Request timeout")
            return False, {}
        except Exception as e:
            self.log_test(name, False, f"Request error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test health endpoint"""
        success, response = self.run_test(
            "Health Check",
            "GET",
            "api/health",
            200
        )
        return success

    def test_register(self):
        """Test user registration"""
        timestamp = datetime.now().strftime('%H%M%S')
        test_data = {
            "email": f"test{timestamp}@gravelmatch.com",
            "password": "test123456",
            "name": "Test Rider"
        }
        
        success, response = self.run_test(
            "User Registration",
            "POST",
            "api/auth/register",
            200,
            data=test_data
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            return True
        return False

    def test_login(self):
        """Test user login with test credentials"""
        test_data = {
            "email": "test@gravelmatch.com",
            "password": "test123456"
        }
        
        success, response = self.run_test(
            "User Login",
            "POST",
            "api/auth/login",
            200,
            data=test_data
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            return True
        return False

    def test_get_profile(self):
        """Test get current user profile"""
        success, response = self.run_test(
            "Get User Profile",
            "GET",
            "api/auth/me",
            200
        )
        
        if success and 'id' in response:
            self.user_id = response['id']
            return True
        return False

    def test_update_profile(self):
        """Test profile update"""
        profile_data = {
            "experience_level": "intermediate",
            "avg_distance": 60,
            "preferred_zone": "Toscana",
            "bio": "Test bio for gravel cycling"
        }
        
        success, response = self.run_test(
            "Update Profile",
            "PUT",
            "api/profile",
            200,
            data=profile_data
        )
        return success

    def test_create_route(self):
        """Test route creation"""
        route_data = {
            "title": "Test Gravel Route",
            "description": "A beautiful test route through Tuscany",
            "distance": 45.5,
            "elevation": 800,
            "difficulty": "moderate",
            "start_point": {
                "name": "Siena Centro",
                "lat": 43.3188,
                "lng": 11.3307
            },
            "tags": ["Panoramico", "Colline"]
        }
        
        success, response = self.run_test(
            "Create Route",
            "POST",
            "api/routes",
            200,
            data=route_data
        )
        
        if success and 'id' in response:
            self.route_id = response['id']
            return True
        return False

    def test_get_routes(self):
        """Test get routes list"""
        success, response = self.run_test(
            "Get Routes List",
            "GET",
            "api/routes",
            200
        )
        return success

    def test_get_route_detail(self):
        """Test get specific route"""
        if hasattr(self, 'route_id'):
            success, response = self.run_test(
                "Get Route Detail",
                "GET",
                f"api/routes/{self.route_id}",
                200
            )
            return success
        else:
            self.log_test("Get Route Detail", False, "No route ID available")
            return False

    def test_like_route(self):
        """Test route like functionality"""
        if hasattr(self, 'route_id'):
            success, response = self.run_test(
                "Like Route",
                "POST",
                f"api/routes/{self.route_id}/like",
                200
            )
            return success
        else:
            self.log_test("Like Route", False, "No route ID available")
            return False

    def test_discover_users(self):
        """Test user discovery"""
        success, response = self.run_test(
            "Discover Users",
            "GET",
            "api/discover",
            200
        )
        return success

    def test_discover_with_filters(self):
        """Test user discovery with advanced filters"""
        # Test age filters
        success1, response1 = self.run_test(
            "Discover Users - Age Filter",
            "GET",
            "api/discover?min_age=25&max_age=45",
            200
        )
        
        # Test distance filters
        success2, response2 = self.run_test(
            "Discover Users - Distance Filter",
            "GET",
            "api/discover?min_distance=30&max_distance=80",
            200
        )
        
        # Test experience level filter
        success3, response3 = self.run_test(
            "Discover Users - Level Filter",
            "GET",
            "api/discover?experience_level=intermediate",
            200
        )
        
        # Test zone filter
        success4, response4 = self.run_test(
            "Discover Users - Zone Filter",
            "GET",
            "api/discover?zone=Toscana",
            200
        )
        
        # Test combined filters
        success5, response5 = self.run_test(
            "Discover Users - Combined Filters",
            "GET",
            "api/discover?min_age=25&max_age=50&experience_level=intermediate&zone=Toscana",
            200
        )
        
        return success1 and success2 and success3 and success4 and success5

    def test_get_matches(self):
        """Test get matches"""
        success, response = self.run_test(
            "Get Matches",
            "GET",
            "api/matches",
            200
        )
        return success

    def test_notifications(self):
        """Test notification system"""
        # Test get notifications
        success1, response1 = self.run_test(
            "Get Notifications",
            "GET",
            "api/notifications",
            200
        )
        
        # Test get unread count
        success2, response2 = self.run_test(
            "Get Unread Count",
            "GET",
            "api/notifications/unread-count",
            200
        )
        
        # Test mark all as read
        success3, response3 = self.run_test(
            "Mark All Notifications Read",
            "PUT",
            "api/notifications/read-all",
            200
        )
        
        return success1 and success2 and success3

    def test_image_upload_endpoints(self):
        """Test image upload endpoints (without actual file)"""
        # Test image upload endpoint exists (will fail without file, but should return proper error)
        success1, response1 = self.run_test(
            "Image Upload Endpoint Check",
            "POST",
            "api/upload/image",
            422  # Expecting validation error for missing file
        )
        
        # Test profile picture upload endpoint exists
        success2, response2 = self.run_test(
            "Profile Picture Upload Endpoint Check", 
            "POST",
            "api/upload/profile-picture",
            422  # Expecting validation error for missing file
        )
        
        return success1 and success2

    def test_ai_route_suggestions(self):
        """Test AI route suggestions"""
        success, response = self.run_test(
            "AI Route Suggestions",
            "GET",
            "api/ai/route-suggestions",
            200
        )
        return success

    def test_invalid_endpoints(self):
        """Test invalid endpoints return proper errors"""
        success, response = self.run_test(
            "Invalid Endpoint 404",
            "GET",
            "api/nonexistent",
            404
        )
        return success

    def test_unauthorized_access(self):
        """Test unauthorized access"""
        # Temporarily remove token
        temp_token = self.token
        self.token = None
        
        success, response = self.run_test(
            "Unauthorized Access",
            "GET",
            "api/auth/me",
            401
        )
        
        # Restore token
        self.token = temp_token
        return success

def main():
    print("🚀 Starting GravelMatch API Tests...")
    print("=" * 50)
    
    tester = GravelMatchAPITester()
    
    # Test sequence
    tests = [
        ("Health Check", tester.test_health_check),
        ("User Login", tester.test_login),
        ("Get Profile", tester.test_get_profile),
        ("Update Profile", tester.test_update_profile),
        ("Create Route", tester.test_create_route),
        ("Get Routes", tester.test_get_routes),
        ("Get Route Detail", tester.test_get_route_detail),
        ("Like Route", tester.test_like_route),
        ("Discover Users", tester.test_discover_users),
        ("Discover with Filters", tester.test_discover_with_filters),
        ("Get Matches", tester.test_get_matches),
        ("Notifications System", tester.test_notifications),
        ("Image Upload Endpoints", tester.test_image_upload_endpoints),
        ("AI Route Suggestions", tester.test_ai_route_suggestions),
        ("Invalid Endpoint", tester.test_invalid_endpoints),
        ("Unauthorized Access", tester.test_unauthorized_access),
    ]
    
    # Run all tests
    for test_name, test_func in tests:
        try:
            test_func()
        except Exception as e:
            tester.log_test(test_name, False, f"Exception: {str(e)}")
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.failed_tests:
        print("\n❌ Failed Tests:")
        for failed in tester.failed_tests:
            print(f"  - {failed['test']}: {failed['error']}")
    
    # Calculate success rate
    success_rate = (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0
    print(f"📈 Success Rate: {success_rate:.1f}%")
    
    return 0 if success_rate >= 80 else 1

if __name__ == "__main__":
    sys.exit(main())