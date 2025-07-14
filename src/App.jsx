import { useState, useEffect } from 'react'
import './App.css'

// Corporate Warehouse Component
function CorporateWarehouse({ addPartRequest }) {
  const [currentView, setCurrentView] = useState('dashboard') // 'dashboard' or 'branch-orders'
  const [selectedBranch, setSelectedBranch] = useState(null)
  const [partFormData, setPartFormData] = useState({
    name: '',
    partDescription: '',
    quantity: '',
    urgency: 'standard',
    contactMethod: 'email'
  })
  const [submittedRequests, setSubmittedRequests] = useState([])
  const [showAddPartForm, setShowAddPartForm] = useState(false)
  const [newPartData, setNewPartData] = useState({
    partNumber: '',
    description: '',
    quantity: ''
  })
  const [branchOrders, setBranchOrders] = useState({})
  const [newlyAddedParts, setNewlyAddedParts] = useState(new Set())

  // Sample branch data with weekly orders
  const branches = [
    { 
      id: 'indy-west',
      name: 'Indy West',
      location: 'Indianapolis West',
      poNumber: 'PO-IW-2025-003',
      orderDate: '2025-01-14',
      orders: [
        { partNumber: 'K180-1234', description: 'Air Filter Element', quantity: 25 },
        { partNumber: 'K180-5678', description: 'Oil Filter', quantity: 40 },
        { partNumber: 'K180-9012', description: 'Fuel Filter', quantity: 15 },
        { partNumber: 'T660-3456', description: 'Brake Pad Set', quantity: 8 },
        { partNumber: 'T880-7890', description: 'Windshield Wipers', quantity: 12 },
        { partNumber: 'W900-1122', description: 'Headlight Assembly', quantity: 6 }
      ]
    },
    { 
      id: 'indy-east',
      name: 'Indy East',
      location: 'Indianapolis East',
      poNumber: 'PO-IE-2025-007',
      orderDate: '2025-01-14',
      orders: [
        { partNumber: 'T680-2468', description: 'Transmission Filter', quantity: 18 },
        { partNumber: 'T880-1357', description: 'Drive Belt', quantity: 22 },
        { partNumber: 'K180-2580', description: 'Radiator Hose', quantity: 14 },
        { partNumber: 'W900-3691', description: 'Mirror Assembly', quantity: 10 },
        { partNumber: 'T660-4702', description: 'Starter Motor', quantity: 5 },
        { partNumber: 'K180-5813', description: 'Alternator', quantity: 7 }
      ]
    },
    { 
      id: 'louisville',
      name: 'Louisville',
      location: 'Louisville, KY',
      poNumber: 'PO-LV-2025-012',
      orderDate: '2025-01-14',
      orders: [
        { partNumber: 'T880-6924', description: 'Shock Absorber', quantity: 16 },
        { partNumber: 'K180-7035', description: 'Coolant Pump', quantity: 9 },
        { partNumber: 'W900-8146', description: 'Exhaust Pipe', quantity: 11 },
        { partNumber: 'T660-9257', description: 'Turbocharger', quantity: 3 },
        { partNumber: 'T680-0368', description: 'Air Compressor', quantity: 6 },
        { partNumber: 'K180-1479', description: 'Power Steering Pump', quantity: 8 }
      ]
    }
  ]

  const handlePartFormSubmit = (e) => {
    e.preventDefault()
    const newRequest = {
      id: Date.now(),
      ...partFormData,
      dateSubmitted: new Date().toLocaleDateString(),
      status: 'Pending'
    }
    setSubmittedRequests(prev => [newRequest, ...prev])

    // Create part request for admin dashboard
    const adminRequest = {
      id: `REQ-${Date.now()}`,
      branchName: 'Corporate', // Since this is a general part request
      branchId: 'corporate',
      partNumber: 'N/A', // Part number not specified in general request
      description: partFormData.partDescription,
      quantity: parseInt(partFormData.quantity),
      requestedBy: partFormData.name,
      requestDate: new Date().toLocaleDateString('en-CA'), // YYYY-MM-DD format
      status: 'pending',
      urgency: partFormData.urgency,
      notes: `Contact via ${partFormData.contactMethod}`,
      from: 'Corporate - Part Request Form'
    }

    // Add to global part requests if the function is available
    if (addPartRequest) {
      addPartRequest(adminRequest)
    }

    alert(`Part request submitted successfully!\nRequest ID: ${newRequest.id}\nSent to Admin Dashboard for review.`)
    setPartFormData({ 
      name: '', 
      partDescription: '', 
      quantity: '', 
      urgency: 'standard',
      contactMethod: 'email'
    })
  }

  const handlePartFormChange = (e) => {
    setPartFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleBranchSelect = (branch) => {
    // Initialize branch orders if not already done
    if (!branchOrders[branch.id]) {
      setBranchOrders(prev => ({
        ...prev,
        [branch.id]: [...branch.orders]
      }))
    }
    setSelectedBranch(branch)
    setCurrentView('branch-orders')
  }

  const handleBackToDashboard = () => {
    setCurrentView('dashboard')
    setSelectedBranch(null)
    setShowAddPartForm(false)
  }

  const handleAddPartSubmit = (e) => {
    e.preventDefault()
    if (!newPartData.partNumber || !newPartData.description || !newPartData.quantity) {
      alert('Please fill in all fields')
      return
    }

    const newPart = {
      partNumber: newPartData.partNumber.toUpperCase(),
      description: newPartData.description,
      quantity: parseInt(newPartData.quantity),
      isNewlyAdded: true,
      addedAt: Date.now()
    }

    // Add to branch orders
    setBranchOrders(prev => ({
      ...prev,
      [selectedBranch.id]: [...(prev[selectedBranch.id] || selectedBranch.orders), newPart]
    }))

    // Track newly added part
    const partId = `${selectedBranch.id}-${newPart.partNumber}-${newPart.addedAt}`
    setNewlyAddedParts(prev => new Set([...prev, partId]))

    // Remove the "new" status after 5 seconds
    setTimeout(() => {
      setNewlyAddedParts(prev => {
        const newSet = new Set(prev)
        newSet.delete(partId)
        return newSet
      })
    }, 5000)

    // Create part request for admin dashboard
    const partRequest = {
      id: `REQ-${Date.now()}`,
      branchName: selectedBranch.name,
      branchId: selectedBranch.id,
      partNumber: newPart.partNumber,
      description: newPart.description,
      quantity: newPart.quantity,
      requestedBy: 'CW User', // In real app, this would be the logged-in user
      requestDate: new Date().toLocaleDateString('en-CA'), // YYYY-MM-DD format
      status: 'pending',
      urgency: 'standard',
      notes: `Added to ${selectedBranch.name} weekly order`,
      from: `${selectedBranch.name} - CW Order`
    }

    // Add to global part requests if the function is available
    if (addPartRequest) {
      addPartRequest(partRequest)
    }

    // Reset form and close
    setNewPartData({ partNumber: '', description: '', quantity: '' })
    setShowAddPartForm(false)
    alert(`Part ${newPart.partNumber} added successfully and sent to Admin Dashboard for approval!`)
  }

  const handleNewPartChange = (e) => {
    setNewPartData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const getCurrentBranchOrders = () => {
    if (!selectedBranch) return []
    return branchOrders[selectedBranch.id] || selectedBranch.orders
  }

  const calculateTotalParts = (orders) => {
    return orders.reduce((total, order) => total + order.quantity, 0)
  }

  return (
    <div className="corporate-warehouse">
      <div className="warehouse-header">
        <h1>🏭 Corporate Warehouse</h1>
        <p>
          {currentView === 'dashboard' 
            ? 'Branch order management and part requests'
            : `${selectedBranch.name} - Weekly Order Details`
          }
        </p>
      </div>

      {currentView === 'dashboard' && (
        <div className="warehouse-content">
          {/* Branch Orders Section */}
          <div className="warehouse-section">
            <h2>Branch Weekly Orders</h2>
            <p>Select a branch to view their current weekly parts order:</p>
            <div className="branches-grid">
              {branches.map(branch => (
                <div 
                  key={branch.id} 
                  className="branch-card"
                  onClick={() => handleBranchSelect(branch)}
                >
                  <div className="branch-info">
                    <h3>{branch.name}</h3>
                    <p className="branch-location">{branch.location}</p>
                    <p className="branch-po">PO: {branch.poNumber}</p>
                    <p className="branch-stats">
                      {branch.orders.length} line items • {calculateTotalParts(branch.orders)} total parts
                    </p>
                  </div>
                  <div className="branch-arrow">→</div>
                </div>
              ))}
            </div>
          </div>

          {/* Part Request Form Section */}
          <div className="warehouse-form-section">
            <h2>Submit New Part Request</h2>
            <form onSubmit={handlePartFormSubmit} className="warehouse-part-form">
              <div className="form-row">
                <div className="palmer-form-group">
                  <label htmlFor="name">Your Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={partFormData.name}
                    onChange={handlePartFormChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="palmer-form-group">
                  <label htmlFor="urgency">Urgency Level *</label>
                  <select
                    id="urgency"
                    name="urgency"
                    value={partFormData.urgency}
                    onChange={handlePartFormChange}
                    required
                  >
                    <option value="standard">Standard (5-7 business days)</option>
                    <option value="priority">Priority (2-3 business days)</option>
                    <option value="urgent">Urgent (Same day)</option>
                  </select>
                </div>
              </div>
              
              <div className="palmer-form-group">
                <label htmlFor="partDescription">Part Description *</label>
                <textarea
                  id="partDescription"
                  name="partDescription"
                  value={partFormData.partDescription}
                  onChange={handlePartFormChange}
                  required
                  placeholder="Describe the part you need (include part number, make, model, year if known)"
                  rows="4"
                />
              </div>
              
              <div className="form-row">
                <div className="palmer-form-group">
                  <label htmlFor="quantity">Quantity *</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={partFormData.quantity}
                    onChange={handlePartFormChange}
                    required
                    min="1"
                    placeholder="How many do you need?"
                  />
                </div>
                <div className="palmer-form-group">
                  <label htmlFor="contactMethod">Preferred Contact Method *</label>
                  <select
                    id="contactMethod"
                    name="contactMethod"
                    value={partFormData.contactMethod}
                    onChange={handlePartFormChange}
                    required
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="text">Text Message</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="warehouse-submit-btn">
                Submit Part Request
              </button>
            </form>
          </div>

          {submittedRequests.length > 0 && (
            <div className="warehouse-requests-section">
              <h2>Your Recent Requests</h2>
              <div className="requests-list">
                {submittedRequests.slice(0, 5).map(request => (
                  <div key={request.id} className="request-card">
                    <div className="request-header">
                      <span className="request-id">#{request.id}</span>
                      <span className={`request-status ${request.status.toLowerCase()}`}>
                        {request.status}
                      </span>
                    </div>
                    <div className="request-details">
                      <p><strong>Part:</strong> {request.partDescription}</p>
                      <p><strong>Quantity:</strong> {request.quantity}</p>
                      <p><strong>Urgency:</strong> {request.urgency}</p>
                      <p><strong>Date:</strong> {request.dateSubmitted}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {currentView === 'branch-orders' && selectedBranch && (
        <div className="branch-orders-view">
          <div className="branch-orders-header">
            <button className="back-btn" onClick={handleBackToDashboard}>
              ← Back to Dashboard
            </button>
            <div className="order-summary">
              <h2>{selectedBranch.poNumber}</h2>
              <div className="order-meta">
                <span>Order Date: {selectedBranch.orderDate}</span>
                <span>Total Line Items: {getCurrentBranchOrders().length}</span>
                <span>Total Parts: {calculateTotalParts(getCurrentBranchOrders())}</span>
              </div>
            </div>
            <button 
              className="add-part-btn"
              onClick={() => setShowAddPartForm(true)}
            >
              + Add New Part
            </button>
          </div>

          {showAddPartForm && (
            <div className="add-part-form-container">
              <form onSubmit={handleAddPartSubmit} className="add-part-form">
                <h3>Add New Part to Order</h3>
                <div className="form-row">
                  <div className="palmer-form-group">
                    <label htmlFor="partNumber">Part Number *</label>
                    <input
                      type="text"
                      id="partNumber"
                      name="partNumber"
                      value={newPartData.partNumber}
                      onChange={handleNewPartChange}
                      placeholder="e.g., K180-1234"
                      required
                    />
                  </div>
                  <div className="palmer-form-group">
                    <label htmlFor="description">Description *</label>
                    <input
                      type="text"
                      id="description"
                      name="description"
                      value={newPartData.description}
                      onChange={handleNewPartChange}
                      placeholder="e.g., Air Filter Element"
                      required
                    />
                  </div>
                  <div className="palmer-form-group">
                    <label htmlFor="quantity">Quantity *</label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      value={newPartData.quantity}
                      onChange={handleNewPartChange}
                      min="1"
                      placeholder="1"
                      required
                    />
                  </div>
                </div>
                <div className="form-buttons">
                  <button type="submit" className="submit-part-btn">Add Part</button>
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => setShowAddPartForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
          
          <div className="parts-table-container">
            <table className="parts-table">
              <thead>
                <tr>
                  <th>Part Number</th>
                  <th>Description</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {getCurrentBranchOrders().map((order, index) => {
                  const partId = order.addedAt ? `${selectedBranch.id}-${order.partNumber}-${order.addedAt}` : null
                  const isNewlyAdded = partId && newlyAddedParts.has(partId)
                  
                  return (
                    <tr key={index} className={isNewlyAdded ? 'newly-added-part' : ''}>
                      <td className="part-number">{order.partNumber}</td>
                      <td className="part-description">{order.description}</td>
                      <td className="part-quantity">{order.quantity}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// Palmer Trucks Homepage Recreation Component
function PalmerTrucksHomepage() {

  const truckCategories = [
    { name: 'SLEEPER TRUCKS', icon: '🚛' },
    { name: 'DAY CABS', icon: '🚚' },
    { name: 'CAB & CHASSIS', icon: '🔧' },
    { name: 'DUMP TRUCKS', icon: '🚛' },
    { name: 'BOX TRUCKS', icon: '📦' },
    { name: 'MUNICIPAL TRUCKS', icon: '🏢' },
    { name: 'FLATBEDS', icon: '📐' },
    { name: 'ROLL-OFF & HOOKLIFT', icon: '🏗️' }
  ]

  const services = [
    { title: 'PARTS DEPARTMENT', desc: 'Quality parts to keep you moving', icon: '🔧' },
    { title: 'SERVICE DEPARTMENT', desc: 'Expert maintenance and repairs', icon: '⚙️' },
    { title: 'BODY SHOP', desc: 'Professional collision repair', icon: '🎨' },
    { title: 'WORK TRUCKS', desc: 'Specialized truck solutions', icon: '🚚' },
    { title: 'RENTAL & LEASING', desc: 'Flexible rental options', icon: '📋' },
    { title: 'FINANCING', desc: 'Competitive financing solutions', icon: '💰' }
  ]

  const locations = [
    { state: 'ILLINOIS', cities: ['Illinois', 'Kenworth of Effingham'] },
    { state: 'INDIANA', cities: ['Indiana', 'Kenworth of Fort Wayne', 'Kenworth of Indianapolis', 'Kenworth of Evansville'] },
    { state: 'KENTUCKY', cities: ['Kentucky', 'Kenworth of Louisville', 'Kenworth of Bowling Green'] },
    { state: 'OHIO', cities: ['Ohio', 'Kenworth of Dayton', 'Kenworth of Cincinnati'] }
  ]

  const blogPosts = [
    { title: 'Celebrating the career of Palmer Trucks CFO Jeff Curry', excerpt: 'Palmer Trucks is celebrating the 40-year tenure and retirement of Jeff Curry...' },
    { title: 'Celebrating 40 years of Palmer Trucks leader John Nichols', excerpt: 'To know John Nichols is to experience the quintessential definition of a kind...' },
    { title: 'Easy spring truck maintenance tips', excerpt: 'Learn recommended spring maintenance tips to keep your truck in excellent condition...' }
  ]

  return (
    <div className="palmer-homepage">
      {/* Hero Section */}
      <section className="palmer-hero">
        <div className="palmer-hero-content">
          <h1>On the road since 1965</h1>
          <p className="palmer-tagline">FAMILY OWNED and OPERATED</p>
          <div className="palmer-hero-buttons">
            <button className="palmer-btn-primary">SHOP TRUCKS</button>
            <button className="palmer-btn-secondary">VIEW LOCATIONS</button>
          </div>
        </div>
        <div className="palmer-hero-image">
          🚛
        </div>
      </section>

      {/* Truck Categories */}
      <section className="palmer-section">
        <h2>Shop Trucks by Category</h2>
        <div className="palmer-truck-grid">
          {truckCategories.map((category, index) => (
            <div key={index} className="palmer-truck-card">
              <div className="palmer-truck-icon">{category.icon}</div>
              <h3>{category.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="palmer-section palmer-services">
        <h2>Everything you need to keep your fleet moving forward.</h2>
        <div className="palmer-services-grid">
          {services.map((service, index) => (
            <div key={index} className="palmer-service-card">
              <div className="palmer-service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Locations */}
      <section className="palmer-section">
        <h2>FIND YOUR NEAREST LOCATION</h2>
        <div className="palmer-locations-grid">
          {locations.map((location, index) => (
            <div key={index} className="palmer-location-card">
              <h3>{location.state}</h3>
              <ul>
                {location.cities.slice(0, 3).map((city, cityIndex) => (
                  <li key={cityIndex}>{city}</li>
                ))}
              </ul>
              <button className="palmer-location-btn">View All Locations</button>
            </div>
          ))}
        </div>
      </section>

      {/* Company Story */}
      <section className="palmer-section palmer-story">
        <div className="palmer-story-content">
          <h2>Experience the Palmer difference.</h2>
          <p>
            In 1965, Eldon Palmer, a home-grown Hoosier, started a heavy-duty truck 
            dealership in Indianapolis. A gentle and humble yet determined man, Eldon had a knack 
            for making everyone he met feel special and appreciated. Today, we span four 
            states and employ more than 700 people, going the extra mile to support thousands of 
            trucks moving our nation's most precious goods to where they need to go - 24 
            hours a day, seven days a week.
          </p>
          <div className="palmer-story-buttons">
            <button className="palmer-btn-primary">View Open Positions →</button>
            <button className="palmer-btn-secondary">Learn More About Who we are →</button>
          </div>
        </div>
        <div className="palmer-story-stats">
          <div className="palmer-stat">
            <h3>60+</h3>
            <p>Years in Business</p>
          </div>
          <div className="palmer-stat">
            <h3>700+</h3>
            <p>Employees</p>
          </div>
          <div className="palmer-stat">
            <h3>4</h3>
            <p>States Served</p>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="palmer-section">
        <h2>ON THE ROAD BLOG</h2>
        <div className="palmer-blog-grid">
          {blogPosts.map((post, index) => (
            <div key={index} className="palmer-blog-card">
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <button className="palmer-read-more">READ MORE →</button>
            </div>
          ))}
        </div>
        <button className="palmer-btn-secondary">VIEW ALL POSTS →</button>
      </section>

      {/* Footer CTA */}
      <section className="palmer-footer-cta">
        <h2>FREE TIPS, SPECIALS, AND OFFERS</h2>
        <div className="palmer-newsletter">
          <input type="email" placeholder="Enter your email address" />
          <button className="palmer-btn-primary">SUBSCRIBE</button>
        </div>
        <div className="palmer-footer-links">
          <div className="palmer-footer-column">
            <h4>LOCATIONS</h4>
            <p>Kenworth of Indianapolis</p>
            <p>Kenworth of Fort Wayne</p>
            <p>Kenworth of Louisville</p>
          </div>
          <div className="palmer-footer-column">
            <h4>SERVICES</h4>
            <p>New Inventory</p>
            <p>Used Inventory</p>
            <p>Parts & Service</p>
          </div>
          <div className="palmer-footer-column">
            <h4>COMPANY</h4>
            <p>Who We Are</p>
            <p>Careers</p>
            <p>Contact Us</p>
          </div>
        </div>
      </section>
    </div>
  )
}

// Admin Dashboard Component for Corporate Warehouse Employees
function AdminDashboard({ partRequests, setPartRequests }) {
  const [filter, setFilter] = useState('all') // 'all', 'pending', 'approved', 'rejected'
  const [selectedRequest, setSelectedRequest] = useState(null) // For modal popup
  
  // Initialize with sample data if no requests exist
  useEffect(() => {
    if (partRequests.length === 0) {
      const sampleRequests = [
      {
        id: 'REQ-001',
        branchName: 'Indy West',
        branchId: 'indy-west',
        partNumber: 'K180-5555',
        description: 'Heavy Duty Air Filter',
        quantity: 12,
        requestedBy: 'Mike Johnson',
        requestDate: '2025-01-14',
        status: 'pending',
        urgency: 'standard',
        notes: 'Needed for upcoming maintenance schedule',
        from: 'Indy West - Part Request Form'
      },
      {
        id: 'REQ-002',
        branchName: 'Indy East',
        branchId: 'indy-east',
        partNumber: 'T880-9999',
        description: 'Brake Disc Assembly',
        quantity: 6,
        requestedBy: 'Sarah Davis',
        requestDate: '2025-01-13',
        status: 'pending',
        urgency: 'priority',
        notes: 'Customer waiting - urgent repair needed',
        from: 'Indy East - Part Request Form'
      },
      {
        id: 'REQ-003',
        branchName: 'Louisville',
        branchId: 'louisville',
        partNumber: 'W900-4444',
        description: 'Transmission Cooler',
        quantity: 3,
        requestedBy: 'Tom Wilson',
        requestDate: '2025-01-13',
        status: 'approved',
        urgency: 'standard',
        notes: 'Standard stock replenishment',
        from: 'Louisville - Part Request Form'
      },
      {
        id: 'REQ-004',
        branchName: 'Indy West',
        branchId: 'indy-west',
        partNumber: 'K180-7777',
        description: 'LED Headlight Kit',
        quantity: 8,
        requestedBy: 'Mike Johnson',
        requestDate: '2025-01-12',
        status: 'rejected',
        urgency: 'standard',
        notes: 'Cost exceeds budget - alternative part suggested',
        from: 'Indy West - Part Request Form'
      },
      {
        id: 'REQ-005',
        branchName: 'Indy East',
        branchId: 'indy-east',
        partNumber: 'T680-3333',
        description: 'Fuel Injector Set',
        quantity: 4,
        requestedBy: 'Sarah Davis',
        requestDate: '2025-01-14',
        status: 'pending',
        urgency: 'urgent',
        notes: 'Critical repair - truck down',
        from: 'Indy East - Part Request Form'
      }
    ]
    setPartRequests(sampleRequests)
    }
  }, [partRequests.length, setPartRequests])

  const handleStatusChange = (requestId, newStatus) => {
    setPartRequests(prev => 
      prev.map(request => 
        request.id === requestId 
          ? { ...request, status: newStatus }
          : request
      )
    )
  }

  const getFilteredRequests = () => {
    if (filter === 'all') return partRequests
    return partRequests.filter(request => request.status === filter)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107'
      case 'approved': return '#28a745'
      case 'rejected': return '#dc3545'
      default: return '#6c757d'
    }
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'urgent': return '#dc3545'
      case 'priority': return '#fd7e14'
      case 'standard': return '#28a745'
      default: return '#6c757d'
    }
  }

  const pendingCount = partRequests.filter(r => r.status === 'pending').length
  const approvedCount = partRequests.filter(r => r.status === 'approved').length
  const rejectedCount = partRequests.filter(r => r.status === 'rejected').length

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>🏢 Admin Dashboard</h1>
        <p>Corporate Warehouse - Part Request Management</p>
      </div>

      {/* Statistics Cards */}
      <div className="admin-stats">
        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{pendingCount}</h3>
            <p>Pending Requests</p>
          </div>
        </div>
        <div className="stat-card approved">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{approvedCount}</h3>
            <p>Approved</p>
          </div>
        </div>
        <div className="stat-card rejected">
          <div className="stat-icon">❌</div>
          <div className="stat-info">
            <h3>{rejectedCount}</h3>
            <p>Rejected</p>
          </div>
        </div>
        <div className="stat-card total">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>{partRequests.length}</h3>
            <p>Total Requests</p>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="admin-controls">
        <div className="filter-section">
          <label htmlFor="statusFilter">Filter by Status:</label>
          <select
            id="statusFilter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="admin-select"
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Requests Table */}
      <div className="admin-table-container">
        <h2>Part Requests ({getFilteredRequests().length})</h2>
        <div className="requests-table-wrapper">
          <table className="admin-requests-table">
            <thead>
              <tr>
                <th>Branch</th>
                <th>From</th>
                <th>Part Number</th>
                <th>Date</th>
                <th>Qty</th>
                <th>Urgency</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredRequests().map(request => (
                <tr 
                  key={request.id} 
                  className={`request-row ${request.status}`}
                  onClick={() => setSelectedRequest(request)}
                  style={{ cursor: 'pointer' }}
                  title="Click to view details"
                >
                  <td className="branch-col">
                    <div className="branch-info">
                      <strong>{request.branchName}</strong>
                    </div>
                  </td>
                  <td className="from-col">
                    <span className="from-badge">{request.from}</span>
                  </td>
                  <td className="part-number-col">
                    <code>{request.partNumber}</code>
                  </td>
                  <td className="date-col">{request.requestDate}</td>
                  <td className="quantity-col">
                    <span className="quantity-badge">{request.quantity}</span>
                  </td>
                  <td className="urgency-col">
                    <span 
                      className="urgency-badge"
                      style={{ backgroundColor: getUrgencyColor(request.urgency) }}
                    >
                      {request.urgency.toUpperCase()}
                    </span>
                  </td>
                  <td className="status-col">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(request.status) }}
                    >
                      {request.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {getFilteredRequests().length === 0 && (
          <div className="no-requests">
            <p>No requests found matching the current filter.</p>
          </div>
        )}
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
          <div className="request-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Part Request Details</h2>
              <button 
                className="modal-close-btn"
                onClick={() => setSelectedRequest(null)}
                title="Close"
              >
                ✕
              </button>
            </div>
            
            <div className="modal-content">
              <div className="request-details-grid">
                <div className="detail-item">
                  <label>Request ID:</label>
                  <span className="request-id-display">{selectedRequest.id}</span>
                </div>
                
                <div className="detail-item">
                  <label>Branch:</label>
                  <span className="branch-display">{selectedRequest.branchName}</span>
                </div>
                
                <div className="detail-item">
                  <label>Source:</label>
                  <span className="from-display">{selectedRequest.from}</span>
                </div>
                
                <div className="detail-item">
                  <label>Part Number:</label>
                  <span className="part-number-display">{selectedRequest.partNumber}</span>
                </div>
                
                <div className="detail-item full-width">
                  <label>Description:</label>
                  <span className="description-display">{selectedRequest.description}</span>
                </div>
                
                <div className="detail-item">
                  <label>Quantity:</label>
                  <span className="quantity-display">{selectedRequest.quantity}</span>
                </div>
                
                <div className="detail-item">
                  <label>Requested By:</label>
                  <span className="requester-display">{selectedRequest.requestedBy}</span>
                </div>
                
                <div className="detail-item">
                  <label>Request Date:</label>
                  <span className="date-display">{selectedRequest.requestDate}</span>
                </div>
                
                <div className="detail-item">
                  <label>Urgency:</label>
                  <span 
                    className="urgency-display"
                    style={{ 
                      backgroundColor: getUrgencyColor(selectedRequest.urgency),
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      textTransform: 'uppercase'
                    }}
                  >
                    {selectedRequest.urgency}
                  </span>
                </div>
                
                <div className="detail-item">
                  <label>Status:</label>
                  <span 
                    className="status-display"
                    style={{ 
                      backgroundColor: getStatusColor(selectedRequest.status),
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      textTransform: 'uppercase'
                    }}
                  >
                    {selectedRequest.status}
                  </span>
                </div>
                
                {selectedRequest.notes && (
                  <div className="detail-item full-width">
                    <label>Notes:</label>
                    <span className="notes-display">{selectedRequest.notes}</span>
                  </div>
                )}
              </div>
              
              <div className="modal-actions">
                <h3>Actions</h3>
                <div className="modal-action-buttons">
                  {selectedRequest.status === 'pending' && (
                    <>
                      <button
                        className="approve-btn modal-btn"
                        onClick={() => {
                          handleStatusChange(selectedRequest.id, 'approved')
                          setSelectedRequest({ ...selectedRequest, status: 'approved' })
                        }}
                      >
                        ✅ Approve Request
                      </button>
                      <button
                        className="reject-btn modal-btn"
                        onClick={() => {
                          handleStatusChange(selectedRequest.id, 'rejected')
                          setSelectedRequest({ ...selectedRequest, status: 'rejected' })
                        }}
                      >
                        ❌ Reject Request
                      </button>
                    </>
                  )}
                  {selectedRequest.status !== 'pending' && (
                    <button
                      className="reset-btn modal-btn"
                      onClick={() => {
                        handleStatusChange(selectedRequest.id, 'pending')
                        setSelectedRequest({ ...selectedRequest, status: 'pending' })
                      }}
                    >
                      🔄 Reset to Pending
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Main App Component
function App() {
  // State Management
  const [theme, setTheme] = useState('light')
  const [activeMainTab, setActiveMainTab] = useState('palmer')
  const [globalPartRequests, setGlobalPartRequests] = useState([])

  // Function to add new part request
  const addPartRequest = (newRequest) => {
    setGlobalPartRequests(prev => [newRequest, ...prev])
  }

  // useEffect Hook for theme changes
  useEffect(() => {
    document.title = 'Palmer Trucks Business Portal'
  }, [])

  useEffect(() => {
    console.log('Theme changed to:', theme)
    document.body.className = theme
  }, [theme])

  // Theme toggle handler
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <div className={`app ${theme}`}>
      <header className="app-header">
        <h1>🚛 Palmer Trucks Business Portal</h1>
        <div className="header-links">
          <a 
            href="https://www.palmertrucks.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="palmer-link"
          >
            🌐 Visit Palmer Trucks
          </a>
          <button onClick={toggleTheme} className="theme-toggle">
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
          </button>
        </div>
        
        {/* Main Tab Navigation */}
        <div className="main-tabs">
          <button 
            className={`main-tab ${activeMainTab === 'palmer' ? 'active' : ''}`}
            onClick={() => setActiveMainTab('palmer')}
          >
            🏠 Palmer Trucks Homepage
          </button>
          <button 
            className={`main-tab ${activeMainTab === 'warehouse' ? 'active' : ''}`}
            onClick={() => setActiveMainTab('warehouse')}
          >
            🏭 Corporate Warehouse
          </button>
          <button 
            className={`main-tab ${activeMainTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveMainTab('admin')}
          >
            🏢 Admin Dashboard
          </button>
        </div>
      </header>

      <main className="app-main">
        {activeMainTab === 'palmer' && (
          <PalmerTrucksHomepage />
        )}

        {activeMainTab === 'warehouse' && (
          <CorporateWarehouse addPartRequest={addPartRequest} />
        )}

        {activeMainTab === 'admin' && (
          <AdminDashboard 
            partRequests={globalPartRequests}
            setPartRequests={setGlobalPartRequests}
          />
        )}
      </main>
    </div>
  )
}

export default App
