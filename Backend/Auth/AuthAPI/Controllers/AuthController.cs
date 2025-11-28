using Microsoft.AspNetCore.Mvc;
using AuthAPI.Application.DTOs;
using AuthAPI.Application.Interfaces;
using Npgsql;

namespace AuthAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto registerDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.RegisterAsync(registerDto);
            if (result == null)
            {
                return BadRequest("Email already exists");
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Kayıt işlemi sırasında hata oluştu");
            
            // Check if it's a database connection error
            if (ex.InnerException is Npgsql.NpgsqlException || 
                ex.Message.Contains("Failed to connect") || 
                ex.Message.Contains("connection"))
            {
                return StatusCode(503, new { error = "Veritabanı bağlantısı kurulamadı. Lütfen veritabanı servisinin çalıştığından emin olun." });
            }
            
            return StatusCode(500, new { error = "Bir hata oluştu" });
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto loginDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.LoginAsync(loginDto);
            if (result == null)
            {
                return Unauthorized("Invalid email or password");
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Giriş işlemi sırasında hata oluştu");
            
            // Check if it's a database connection error
            if (ex.InnerException is Npgsql.NpgsqlException || 
                ex.Message.Contains("Failed to connect") || 
                ex.Message.Contains("connection"))
            {
                return StatusCode(503, new { error = "Veritabanı bağlantısı kurulamadı. Lütfen veritabanı servisinin çalıştığından emin olun." });
            }
            
            return StatusCode(500, new { error = "Bir hata oluştu" });
        }
    }
}

