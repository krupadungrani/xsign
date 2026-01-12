const fs = require('fs');
const path = require('path');

// Direct PDF endpoint test
async function testPdfDirect() {
  console.log('🔍 Direct PDF Endpoint Test');
  console.log('===========================');
  
  try {
    // Check if uploads directory exists
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      console.log('❌ Uploads directory does not exist');
      return;
    }
    
    // Find PDF files
    const files = fs.readdirSync(uploadsDir);
    const pdfFiles = files.filter(f => f.endsWith('.pdf'));
    
    if (pdfFiles.length === 0) {
      console.log('❌ No PDF files found in uploads directory');
      return;
    }
    
    console.log(`📁 Found ${pdfFiles.length} PDF files`);
    
    // Test each PDF file
    for (const pdfFile of pdfFiles) {
      console.log(`\n📄 Testing: ${pdfFile}`);
      
      const filePath = path.join(uploadsDir, pdfFile);
      const stats = fs.statSync(filePath);
      console.log(`   Size: ${stats.size} bytes`);
      
      // Check if file is readable
      try {
        const content = fs.readFileSync(filePath);
        console.log(`   ✅ File is readable (${content.length} bytes)`);
        
        // Check if it looks like a PDF (starts with %PDF)
        const header = content.toString('utf8', 0, 4);
        if (header === '%PDF') {
          console.log(`   ✅ Valid PDF header: ${header}`);
        } else {
          console.log(`   ⚠️ Invalid PDF header: ${header}`);
        }
        
      } catch (error) {
        console.log(`   ❌ File read error: ${error.message}`);
      }
    }
    
    // Test server health
    console.log('\n🌐 Testing server health...');
    try {
      const healthResponse = await fetch('http://localhost:5000/api/health');
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        console.log('✅ Server is running:', healthData);
      } else {
        console.log('❌ Server health check failed:', healthResponse.status);
      }
    } catch (error) {
      console.log('❌ Server not accessible:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testPdfDirect();
