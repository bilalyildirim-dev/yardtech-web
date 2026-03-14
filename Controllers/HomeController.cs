using Microsoft.AspNetCore.Mvc;
using YardTech.Web.Models;

namespace YardTech.Web.Controllers;

public class HomeController : Controller
{
    public IActionResult Index() => View();
    public IActionResult About() => View();
    public IActionResult Services() => View();
    public IActionResult Contact() => View();

    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult Contact(ContactViewModel model)
    {
        if (ModelState.IsValid)
        {
            TempData["Success"] = "Mesajınız başarıyla iletildi. En kısa sürede dönüş yapacağız.";
            return RedirectToAction(nameof(Contact));
        }
        return View(model);
    }
}
