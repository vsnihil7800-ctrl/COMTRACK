// ── Location Incharge Map by Pincode ─────────────────────────────────────────
// Add more pincodes and incharge details as needed
// Format: "pincode": { area, city, name, phone, department }

export const pincodeInchargeMap = {
  // ── BANGALORE ──────────────────────────────────────────────────────────────
  "560001": { area: "MG Road", city: "Bangalore", name: "Ramesh Kumar", phone: "9876501001", department: "BBMP Zone 1" },
  "560002": { area: "Shivajinagar", city: "Bangalore", name: "Suresh Nair", phone: "9876501002", department: "BBMP Zone 1" },
  "560010": { area: "Rajajinagar", city: "Bangalore", name: "Anand Rao", phone: "9876501010", department: "BBMP West Zone" },
  "560011": { area: "Malleswaram", city: "Bangalore", name: "Priya Sharma", phone: "9876501011", department: "BBMP West Zone" },
  "560034": { area: "Jayanagar", city: "Bangalore", name: "Kiran Reddy", phone: "9876501034", department: "BBMP South Zone" },
  "560038": { area: "JP Nagar", city: "Bangalore", name: "Venkat Rao", phone: "9876501038", department: "BBMP South Zone" },
  "560068": { area: "Electronic City", city: "Bangalore", name: "Deepak Menon", phone: "9876501068", department: "BBMP South Zone" },
  "560076": { area: "Whitefield", city: "Bangalore", name: "Arun Kumar", phone: "9876501076", department: "BBMP East Zone" },
  "560103": { area: "Hebbal", city: "Bangalore", name: "Sanjay Patil", phone: "9876501103", department: "BBMP North Zone" },

  // ── CHENNAI ────────────────────────────────────────────────────────────────
  "600001": { area: "Chennai Central", city: "Chennai", name: "Murugan S", phone: "9876502001", department: "GCC Zone 1" },
  "600002": { area: "Royapettah", city: "Chennai", name: "Selvam R", phone: "9876502002", department: "GCC Zone 2" },
  "600010": { area: "Nungambakkam", city: "Chennai", name: "Kavitha M", phone: "9876502010", department: "GCC Zone 3" },
  "600020": { area: "Adyar", city: "Chennai", name: "Rajan P", phone: "9876502020", department: "GCC South Zone" },
  "600040": { area: "Anna Nagar", city: "Chennai", name: "Lakshmi V", phone: "9876502040", department: "GCC North Zone" },
  "600042": { area: "Tambaram", city: "Chennai", name: "Balan K", phone: "9876502042", department: "GCC South Zone" },
  "600096": { area: "Sholinganallur", city: "Chennai", name: "Pradeep T", phone: "9876502096", department: "GCC IT Corridor" },

  // ── HYDERABAD ──────────────────────────────────────────────────────────────
  "500001": { area: "Hyderabad Central", city: "Hyderabad", name: "Ravi Shankar", phone: "9876503001", department: "GHMC Zone 1" },
  "500003": { area: "Secunderabad", city: "Hyderabad", name: "Naresh Reddy", phone: "9876503003", department: "GHMC Zone 2" },
  "500016": { area: "Banjara Hills", city: "Hyderabad", name: "Sunil Varma", phone: "9876503016", department: "GHMC West Zone" },
  "500032": { area: "Kukatpally", city: "Hyderabad", name: "Prasad G", phone: "9876503032", department: "GHMC North Zone" },
  "500081": { area: "Gachibowli", city: "Hyderabad", name: "Vikram Rao", phone: "9876503081", department: "GHMC IT Zone" },
  "500034": { area: "Madhapur", city: "Hyderabad", name: "Arjun Singh", phone: "9876503034", department: "GHMC IT Zone" },

  // ── MUMBAI ─────────────────────────────────────────────────────────────────
  "400001": { area: "Fort", city: "Mumbai", name: "Rajesh Desai", phone: "9876504001", department: "MCGM Zone 1" },
  "400050": { area: "Bandra", city: "Mumbai", name: "Akash Mehta", phone: "9876504050", department: "MCGM West Zone" },
  "400051": { area: "Andheri", city: "Mumbai", name: "Priya Joshi", phone: "9876504051", department: "MCGM West Zone" },
  "400070": { area: "Kurla", city: "Mumbai", name: "Santosh Patil", phone: "9876504070", department: "MCGM East Zone" },
  "400097": { area: "Borivali", city: "Mumbai", name: "Nilesh Shah", phone: "9876504097", department: "MCGM North Zone" },

  // ── DELHI ──────────────────────────────────────────────────────────────────
  "110001": { area: "Connaught Place", city: "Delhi", name: "Vikram Sharma", phone: "9876505001", department: "MCD Central" },
  "110005": { area: "Karol Bagh", city: "Delhi", name: "Sunita Gupta", phone: "9876505005", department: "MCD Central" },
  "110019": { area: "Lajpat Nagar", city: "Delhi", name: "Amit Verma", phone: "9876505019", department: "MCD South" },
  "110075": { area: "Dwarka", city: "Delhi", name: "Rohit Singh", phone: "9876505075", department: "MCD West" },
  "110092": { area: "Preet Vihar", city: "Delhi", name: "Neha Kapoor", phone: "9876505092", department: "MCD East" },

  // ── PUNE ───────────────────────────────────────────────────────────────────
  "411001": { area: "Pune Central", city: "Pune", name: "Sachin Deshpande", phone: "9876506001", department: "PMC Zone 1" },
  "411007": { area: "Shivajinagar", city: "Pune", name: "Meera Kulkarni", phone: "9876506007", department: "PMC Zone 2" },
  "411028": { area: "Pimpri", city: "Pune", name: "Rahul Jadhav", phone: "9876506028", department: "PCMC Zone 1" },
  "411045": { area: "Hadapsar", city: "Pune", name: "Tushar More", phone: "9876506045", department: "PMC East Zone" },
};

// ── Get incharge by pincode ───────────────────────────────────────────────────
export function getInchargeByPincode(pincode) {
  return pincodeInchargeMap[pincode] || null;
}

// ── Fetch pincode from GPS coordinates using OpenStreetMap (free) ─────────────
export async function getPincodeFromCoords(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { "Accept-Language": "en" } }
    );
    const data = await res.json();
    const pincode =
      data.address?.postcode ||
      data.address?.postal_code ||
      null;
    return pincode ? pincode.replace(/\s/g, "").substring(0, 6) : null;
  } catch {
    return null;
  }
}

// ── Get user location and return incharge details ─────────────────────────────
export async function getLocationIncharge() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ error: "Geolocation not supported" });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const pincode = await getPincodeFromCoords(latitude, longitude);
        if (!pincode) {
          resolve({ error: "Could not detect pincode", latitude, longitude });
          return;
        }
        const incharge = getInchargeByPincode(pincode);
        resolve({
          pincode,
          latitude,
          longitude,
          incharge: incharge || null,
          error: incharge ? null : `No incharge found for pincode ${pincode}`,
        });
      },
      (err) => {
        resolve({ error: "Location permission denied" });
      },
      { timeout: 10000 }
    );
  });
}