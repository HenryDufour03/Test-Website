import { useState, useEffect } from 'react'
import './App.css'

// Component demonstrating Props
function Welcome({ name, age }) {
  return (
    <div className="welcome-card">
      <h3>Welcome, {name}!</h3>
      <p>Age: {age}</p>
    </div>
  )
}

// Component demonstrating Lists & Keys
function TaskList({ tasks, onToggle, onDelete }) {
  return (
    <div className="task-list">
      <h3>Task List</h3>
      {tasks.length === 0 ? (
        <p>No tasks yet!</p>
      ) : (
        <ul>
          {tasks.map(task => (
            <li key={task.id} className={task.completed ? 'completed' : ''}>
              <span onClick={() => onToggle(task.id)}>{task.text}</span>
              <button onClick={() => onDelete(task.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Component demonstrating Forms & Controlled Components
function AddTaskForm({ onAddTask }) {
  const [taskText, setTaskText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (taskText.trim()) {
      onAddTask(taskText.trim())
      setTaskText('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="add-task-form">
      <input
        type="text"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
        placeholder="Enter a new task"
      />
      <button type="submit">Add Task</button>
    </form>
  )
}

// Component demonstrating API Calls & Data Fetching
function ApiDemo() {
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('users')

  // Fetch users from JSONPlaceholder API
  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setUsers(data.slice(0, 5)) // Only show first 5 users
    } catch (err) {
      setError(`Failed to fetch users: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Fetch posts from JSONPlaceholder API
  const fetchPosts = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setPosts(data.slice(0, 5)) // Only show first 5 posts
    } catch (err) {
      setError(`Failed to fetch posts: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Auto-fetch users when component mounts
  useEffect(() => {
    fetchUsers()
  }, [])

  // Handle tab switching
  const handleTabSwitch = (tab) => {
    setActiveTab(tab)
    if (tab === 'users' && users.length === 0) {
      fetchUsers()
    } else if (tab === 'posts' && posts.length === 0) {
      fetchPosts()
    }
  }

  return (
    <div className="api-demo">
      <h3>API Data Fetching</h3>
      
      {/* Tab Navigation */}
      <div className="api-tabs">
        <button 
          className={`api-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => handleTabSwitch('users')}
        >
          👥 Users
        </button>
        <button 
          className={`api-tab ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => handleTabSwitch('posts')}
        >
          📝 Posts
        </button>
      </div>

      {/* Refresh Button */}
      <div className="api-controls">
        <button 
          onClick={activeTab === 'users' ? fetchUsers : fetchPosts}
          disabled={loading}
          className="refresh-btn"
        >
          {loading ? '🔄 Loading...' : '🔄 Refresh Data'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="api-error">
          ❌ {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="api-loading">
          <div className="spinner"></div>
          <p>Fetching {activeTab}...</p>
        </div>
      )}

      {/* Data Display */}
      {!loading && !error && (
        <div className="api-content">
          {activeTab === 'users' && (
            <div className="users-list">
              {users.map(user => (
                <div key={user.id} className="user-card">
                  <h4>{user.name}</h4>
                  <p>📧 {user.email}</p>
                  <p>🏢 {user.company.name}</p>
                  <p>🌐 {user.website}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="posts-list">
              {posts.map(post => (
                <div key={post.id} className="post-card">
                  <h4>{post.title}</h4>
                  <p>{post.body}</p>
                  <small>User ID: {post.userId}</small>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* API Info */}
      <div className="api-info">
        <small>
          📡 Data fetched from{' '}
          <a 
            href="https://jsonplaceholder.typicode.com/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            JSONPlaceholder API
          </a>
        </small>
      </div>
    </div>
  )
}

// Corporate Warehouse Component
function CorporateWarehouse() {
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
    alert(`Part request submitted successfully!\nRequest ID: ${newRequest.id}`)
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

    // Reset form and close
    setNewPartData({ partNumber: '', description: '', quantity: '' })
    setShowAddPartForm(false)
    alert(`Part ${newPart.partNumber} added successfully!`)
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

// Main App Component
function App() {
  // State Management with useState
  const [count, setCount] = useState(0)
  const [user, setUser] = useState({ name: 'John Doe', age: 25 })
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Learn React basics', completed: false },
    { id: 2, text: 'Practice useState', completed: true },
    { id: 3, text: 'Master useEffect', completed: false }
  ])
  const [theme, setTheme] = useState('light')
  const [activeMainTab, setActiveMainTab] = useState('palmer')

  // useEffect Hook - runs after component mounts and when dependencies change
  useEffect(() => {
    document.title = `React Playground - Count: ${count}`
  }, [count])

  useEffect(() => {
    console.log('Theme changed to:', theme)
    document.body.className = theme
  }, [theme])

  // Event Handlers
  const handleIncrement = () => setCount(count + 1)
  const handleDecrement = () => setCount(count - 1)
  const handleReset = () => setCount(0)

  const handleUserUpdate = () => {
    setUser(prev => ({
      ...prev,
      age: prev.age + 1
    }))
  }

  const addTask = (taskText) => {
    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false
    }
    setTasks(prev => [...prev, newTask])
  }

  const toggleTask = (taskId) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
  }

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <div className={`app ${theme}`}>
      <header className="app-header">
        <h1>🚀 React Fundamentals Playground</h1>
        <div className="header-links">
          <a 
            href="https://www.palmertrucks.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="palmer-link"
          >
            🚛 Palmer Trucks
          </a>
          <button onClick={toggleTheme} className="theme-toggle">
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
          </button>
        </div>
        
        {/* Main Tab Navigation */}
        <div className="main-tabs">
          <button 
            className={`main-tab ${activeMainTab === 'playground' ? 'active' : ''}`}
            onClick={() => setActiveMainTab('playground')}
          >
            📚 React Playground
          </button>
          <button 
            className={`main-tab ${activeMainTab === 'palmer' ? 'active' : ''}`}
            onClick={() => setActiveMainTab('palmer')}
          >
            🚛 Palmer Trucks Homepage
          </button>
          <button 
            className={`main-tab ${activeMainTab === 'warehouse' ? 'active' : ''}`}
            onClick={() => setActiveMainTab('warehouse')}
          >
            🏭 Corporate Warehouse
          </button>
        </div>
      </header>

      <main className="app-main">
        {activeMainTab === 'playground' && (
          <>
            {/* 1. State Management & Event Handling */}
            <section className="section">
              <h2>1. State Management & Event Handling</h2>
              <div className="counter">
                <h3>Counter: {count}</h3>
                <div className="counter-buttons">
                  <button onClick={handleDecrement}>-</button>
                  <button onClick={handleReset}>Reset</button>
                  <button onClick={handleIncrement}>+</button>
                </div>
              </div>
            </section>

            {/* 2. Props */}
            <section className="section">
              <h2>2. Props</h2>
              <Welcome name={user.name} age={user.age} />
              <button onClick={handleUserUpdate}>Happy Birthday! 🎉</button>
            </section>

            {/* 3. Conditional Rendering */}
            <section className="section">
              <h2>3. Conditional Rendering</h2>
              <div className="conditional-demo">
                {count === 0 ? (
                  <p>🎯 Counter is at zero!</p>
                ) : count > 0 ? (
                  <p>✅ Counter is positive: {count}</p>
                ) : (
                  <p>❌ Counter is negative: {count}</p>
                )}
              </div>
            </section>

            {/* 4. Lists, Keys & Forms */}
            <section className="section">
              <h2>4. Lists, Keys & Forms</h2>
              <AddTaskForm onAddTask={addTask} />
              <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />
            </section>

            {/* 5. API Calls & Data Fetching */}
            <section className="section">
              <h2>5. API Calls & Data Fetching</h2>
              <ApiDemo />
            </section>

            {/* 6. Summary */}
            <section className="section">
              <h2>6. Summary</h2>
              <div className="summary">
                <p>🔢 Current count: <strong>{count}</strong></p>
                <p>👤 User: <strong>{user.name}</strong> (Age: {user.age})</p>
                <p>📝 Total tasks: <strong>{tasks.length}</strong></p>
                <p>✅ Completed: <strong>{tasks.filter(t => t.completed).length}</strong></p>
                <p>🎨 Theme: <strong>{theme}</strong></p>
              </div>
            </section>
          </>
        )}

        {activeMainTab === 'palmer' && (
          <PalmerTrucksHomepage />
        )}

        {activeMainTab === 'warehouse' && (
          <CorporateWarehouse />
        )}
      </main>
    </div>
  )
}

export default App
