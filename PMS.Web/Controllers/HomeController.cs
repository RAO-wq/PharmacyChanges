using Microsoft.AspNetCore.Mvc;
using PMS.Web.Models;
using System.Diagnostics;

namespace PMS.Web.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }


        public IActionResult PatientsList()
        {
            // Hard-coded list of patients
            var patients = new List<PatientsData>
                {
                    new PatientsData { PatientId = 1, Name = "John Doe", Age = 45, Gender = "Male" },
                    new PatientsData { PatientId = 2, Name = "Jane Smith", Age = 34, Gender = "Female" },
                    new PatientsData { PatientId = 3, Name = "Jim Brown", Age = 29, Gender = "Male" },
                    new PatientsData { PatientId = 4, Name = "Emily White", Age = 42, Gender = "Female" }
                };

            return View(patients);
        }


        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
