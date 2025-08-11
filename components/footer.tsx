export default function Footer() {
  return (
    <footer className="w-full bg-[#002038] text-white">
      <div className="px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* About Section */}
          <div className="space-y-6">
            <h3 className="text-base font-bold capitalize">About the Digital Services Hub</h3>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold capitalize mb-2">Our Mission</h4>
                <div className="text-sm font-normal capitalize space-y-1">
                  <p>Digital Transformation Strategy</p>
                  <p>Information and Communication Technology Agency (ICTA)</p>
                  <p>News & Updates</p>
                  <p>Careers</p>
                </div>
              </div>

              <div className="space-y-2 text-sm font-light capitalize">
                <p>Phone: +94 11 2356456</p>
                <p>Fax: +94 11 2356456</p>
                <p>Email: info@cse.lk</p>
              </div>
            </div>
          </div>

          {/* Popular Services */}
          <div className="space-y-4">
            <h3 className="text-base font-medium capitalize text-center">Popular Services</h3>
            <div className="text-sm font-medium capitalize space-y-1">
              <p>Land Transfer Service</p>
              <p>Apply for Birth Certificate</p>
              <p>Renew Driving License</p>
              <p>Business Registration</p>
              <p>Passport Application & Renewal</p>
              <p>View All Services</p>
            </div>
          </div>

          {/* Help & Support */}
          <div className="space-y-4">
            <h3 className="text-base font-medium capitalize text-center">Help & Support</h3>
            <div className="text-sm font-medium capitalize space-y-1">
              <p>Frequently Asked Questions (FAQ)</p>
              <p>User Guides & Tutorials</p>
              <p>Track Application Status</p>
              <p>Report a Technical Issue</p>
              <p>Accessibility Statement</p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-[#001627] py-6">
        <div className="text-center space-y-2">
          <p className="text-sm font-medium capitalize">Privacy Policy | Terms & Conditions | Cookie Policy</p>
          <p className="text-sm font-medium capitalize">© 2025 Government of Sri Lanka. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}
